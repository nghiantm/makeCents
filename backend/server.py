from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2 # postgres driver
import os
from dotenv import load_dotenv
from datetime import datetime  # Import datetime for current date
import pdfplumber
import google.generativeai as genai
import io
import csv

# load environment variables from .env file
load_dotenv()

# connect to postgres db
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT"),
)

# set constants
categories = {cat: True for cat in ['travel', 'dining', 'grocery', 'gas', 'online', 'pharma', 'all']}
redeem_methods = {method: True for method in ['cashback', 'travel', 'giftcard']}

app = Flask(__name__)
cors = CORS(app)

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Create Gemini model
model = genai.GenerativeModel('gemini-2.0-flash-lite')

@app.route('/', methods=['GET'])
def hello_world():
    return "<p>ping</p>"

@app.route('/api/card', methods=['GET'])
def get_card_img():
    try:
        # Create a new cursor for this request
        cur = conn.cursor()


        # Execute SQL query to fetch card_id and img_url from cards table
        cur.execute(
            """
            SELECT 
                card_id,
                card_name,
                img_url
            FROM 
                cards
            ORDER BY 
                card_name ASC;
        """
        )

        rows = cur.fetchall()  # Fetch all rows from the result

        # Format the result as JSON
        data = [{"id": row[0], "name": row[1], "img_url": row[2]} for row in rows]

        # Close the cursor
        cur.close()  # Close the cursor after use

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Return error message with HTTP 500 status

@app.route('/api/user/card', methods=['GET'])
def get_user_cards():
    try:
        # Create a new cursor for this request
        cur = conn.cursor()


        # Get the user_id from query parameters
        user_id = request.args.get('user_id')

        # Validate input
        if not user_id:
            return {"error": "Missing user_id"}, 400  # Bad Request

        # Execute SQL query to fetch all cards for the given user_id, including date_added
        cur.execute(
            """
            SELECT uc.card_id, c.card_name, c.card_type, c.img_url, uc.date_added
            FROM user_cards uc
            JOIN cards c ON uc.card_id = c.card_id
            WHERE uc.user_id = %s
            ORDER BY uc.date_added DESC
            """,
            (user_id,)
        )
        rows = cur.fetchall()  # Fetch all rows from the result

        # Format the result as JSON
        data = [
            {
                "card_id": row[0],
                "card_name": row[1],
                "card_type": row[2],
                "img_url": row[3],
                "date_added": row[4].strftime('%Y-%m-%d %H:%M:%S') if row[4] else None  # Include timestamp
            }
            for row in rows
        ]
        
        # Close the cursor
        cur.close()  # Close the cursor after use

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Internal Server Error

@app.route('/api/user/card', methods=['POST'])
def add_user_card():
    try:
        cur = conn.cursor()  # Create a new cursor for this request


        # Parse JSON payload from the request
        data = request.get_json()
        user_id = data.get('user_id')
        card_id = data.get('card_id')

        # Validate input
        if not user_id or not card_id:
            return {"error": "Missing user_id or card_id"}, 400  # Bad Request

        # Get the current date and time
        date_added = datetime.now()

        # Insert the user-card relationship into the user_cards table with date_added
        cur.execute(
            "INSERT INTO user_cards (user_id, card_id, date_added) VALUES (%s, %s, %s)",
            (user_id, card_id, date_added)
        )
        conn.commit()  # Commit the transaction
        cur.close()  # Close the cursor after use
        return {"message": "User card added successfully"}, 201  # Created
    except Exception as e:
        conn.rollback()  # Rollback the transaction in case of error
        return {"error": str(e)}, 500  # Internal Server Error
    
@app.route('/api/user/card', methods=['DELETE'])
def delete_user_card():
    try:
        # Parse JSON payload from the request
        data = request.get_json()
        user_id = data.get('user_id')
        card_id = data.get('card_id')

        # Validate input
        if not user_id or not card_id:
            return {"error": "Missing user_id or card_id"}, 400  # Bad Request

        # Delete the user-card relationship from the user_cards table
        cur.execute(
            "DELETE FROM user_cards WHERE user_id = %s AND card_id = %s",
            (user_id, card_id)
        )
        conn.commit()  # Commit the transaction

        return {"message": "User card deleted successfully"}, 200  # OK
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500  # Internal Server Error

@app.route('/api/user/card/ranking', methods=['GET'])
def get_user_card_ranking():
    try:
        cur = conn.cursor()  # Create a new cursor for this request


        category = request.args.get('category')
        user_id = request.args.get('user_id')
        redeem_method = request.args.get('redeem_method')

        if redeem_method not in redeem_methods:
            return {"error": "Invalid redeem_method"}, 400
        redeem_method = 'point_' + redeem_method + '_equiv'
        if not category or not user_id:
            return {"error": "Missing category or user_id"}, 400
        if category not in categories:
            return {"error": "Invalid category"}, 400
        
        # DO NOT COPY
        # Succeptible to SQL injection
        cur.execute(
            f"""
            SELECT
                c.card_id,
                c.card_name,
                c.card_type,
                c.img_url,  -- Added img_url
                c.perks,    -- Added perks
                c.annual_fee,
                COALESCE(
                    (SELECT {redeem_method}
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT {redeem_method}
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    0) AS {redeem_method},
                COALESCE(
                    (SELECT cashback_pct
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT cashback_pct
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    0) AS cashback_pct,
                COALESCE(
                    (SELECT point_mul
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT point_mul
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    0) AS point_mul,
                COALESCE(
                    (SELECT cr.category
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT cr.category
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    'all') AS category,  -- Display the category used
                RANK() OVER (ORDER BY
                    COALESCE(
                        (SELECT {redeem_method}
                        FROM card_rewards cr
                        WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                        LIMIT 1),
                        (SELECT {redeem_method}
                        FROM card_rewards cr
                        WHERE cr.card_id = c.card_id AND cr.category = 'all'
                        LIMIT 1),
                        0
                    ) DESC
                ) AS travel_rank
            FROM
                user_cards uc
            JOIN
                cards c ON uc.card_id = c.card_id
            WHERE
                uc.user_id = '{user_id}';
            """
        )
        rows = cur.fetchall()  # Fetch all rows from the result

        # Format the result as JSON
        data = [
            {
                "card_id": row[0],
                "card_name": row[1],
                "card_type": row[2],
                "img_url": row[3],  # Added img_url
                "perks": row[4],     # Added perks
                "annual_fee": row[5],  # Added annual_fee
                "reward_equiv": row[6],  # Assuming this corresponds to point_travel_equiv or similar
                "cashback_pct": row[7],
                "point_mul": row[8],
                "rank": row[9],
            }
            for row in rows
        ]

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Internal Server Error

@app.route('/api/card/ranking', methods=['GET'])
def get_cards_ranking():
    try:
        cur = conn.cursor()  # Create a new cursor for this request
        
        category = request.args.get('category')
        redeem_method = request.args.get('redeem_method')

        if redeem_method not in redeem_methods:
            return {"error": "Invalid redeem_method"}, 400
        if not category:
            return {"error": "Missing category"}, 400
        if category not in categories:
            return {"error": "Invalid category"}, 400
        
        # DO NOT COPY
        # Succeptible to SQL injection
        cur.execute(
            f"""
            SELECT
                c.card_id,
                c.card_name,
                c.card_type,
                c.img_url,  -- Added img_url column
                c.perks,    -- Added perks column
                c.annual_fee,
                COALESCE(
                    (SELECT point_{redeem_method}_equiv
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT point_{redeem_method}_equiv
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    0) AS point_{redeem_method}_equiv,
                COALESCE(
                    (SELECT cashback_pct
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT cashback_pct
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    0) AS cashback_pct,
                COALESCE(
                    (SELECT point_mul
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                    LIMIT 1),
                    (SELECT point_mul
                    FROM card_rewards cr
                    WHERE cr.card_id = c.card_id AND cr.category = 'all'
                    LIMIT 1),
                    0) AS point_mul,
                RANK() OVER (ORDER BY
                    COALESCE(
                        (SELECT point_{redeem_method}_equiv
                        FROM card_rewards cr
                        WHERE cr.card_id = c.card_id AND cr.category = '{category}'
                        LIMIT 1),
                        (SELECT point_{redeem_method}_equiv
                        FROM card_rewards cr
                        WHERE cr.card_id = c.card_id AND cr.category = 'all'
                        LIMIT 1),
                        0
                    ) DESC,
                    LENGTH(c.perks::text) DESC  -- Tiebreaker: Larger 'perks' size ranks higher
                ) AS rank
            FROM
                cards c
            ORDER BY
                point_{redeem_method}_equiv DESC, LENGTH(c.perks::text) DESC;  -- Order by points and perks size for tiebreaker
            """
        )
        rows = cur.fetchall()  # Fetch all rows from the result
        
        # Format the result as JSON
        data = [
            {
                "card_id": row[0],
                "card_name": row[1],
                "card_type": row[2],
                "img_url": row[3],  # Added img_url
                "perks": row[4],     # Added perks
                "annual_fee": row[5],  # Added annual_fee
                "reward_equiv": row[6],  # Assuming this corresponds to point_travel_equiv or similar
                "cashback_pct": row[7],
                "point_mul": row[8],
                "rank": row[9],
            }
            for row in rows
        ]

        # Close the cursor
        cur.close()  # Close the cursor after use

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Internal Server Error
    
@app.route('/api/card/recommend', methods=['GET'])
def getCardsForRecommend():
    try:
        cur = conn.cursor()  # Create a new cursor for this request

        cur.execute(
            """
            SELECT
  c.card_id,
  c.card_name,
  c.card_type,         -- Added card_type
  c.annual_fee,        -- Added annual_fee
  c.img_url,           -- Added img_url
  c.perks,             -- Added perks
  jsonb_build_object(
    'travel',          jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'travel'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'travel'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'travel'
                              LIMIT 1), 0)
                       ),
    'dining',          jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'dining'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'dining'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'dining'
                              LIMIT 1), 0)
                       ),
    'grocery',         jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'grocery'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'grocery'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'grocery'
                              LIMIT 1), 0)
                       ),
    'gas',             jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'gas'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'gas'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'gas'
                              LIMIT 1), 0)
                       ),
    'online',          jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'online'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'online'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'online'
                              LIMIT 1), 0)
                       ),
    'pharma',          jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'pharma'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'pharma'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'pharma'
                              LIMIT 1), 0)
                       ),
    'all',             jsonb_build_object(
                         'point_cashback_equiv', COALESCE(
                             (SELECT cr.point_cashback_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'all'
                              LIMIT 1), 0),
                         'point_travel_equiv', COALESCE(
                             (SELECT cr.point_travel_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'all'
                              LIMIT 1), 0),
                         'point_giftcard_equiv', COALESCE(
                             (SELECT cr.point_giftcard_equiv
                              FROM card_rewards cr
                              WHERE cr.card_id = c.card_id AND cr.category = 'all'
                              LIMIT 1), 0)
                       )
  ) AS reward_categories
FROM
  cards c
ORDER BY
  c.card_name;
            """
        )
        rows = cur.fetchall()  # Fetch all rows from the result

        # Format the result as JSON
        data = [
            {
                "card_id": row[0],
                "card_name": row[1],
                "card_type": row[2],
                "annual_fee": row[3],  # Added annual_fee
                "img_url": row[4],  # Added img_url
                "perks": row[5],     # Added perks
                "reward_categories": {
                    category: {
                        "point_cashback_equiv": row[6][category]['point_cashback_equiv'],
                        "point_travel_equiv": row[6][category]['point_travel_equiv'],
                        "point_giftcard_equiv": row[6][category]['point_giftcard_equiv']
                    }
                    for category in ['travel', 'dining', 'grocery', 'gas', 'online', 'pharma', 'all']
                }
            }
            for row in rows
        ]

        # Close the cursor
        cur.close()  # Close the cursor after use

        # Extract text from PDF
        #with pdfplumber.open('statement.pdf') as pdf:
        #    text = ''
        #    for page in pdf.pages:
        #        text += page.extract_text()


        # Ask Gemini to format the text
        prompt = f"""
        Here is a table extracted from a PDF:
        

        Please format the following bank statement data into CSV with these columns: transaction_date, posting_date, description, amount, category.
        The category will either be 'travel', 'dining', 'online', 'grocery', 'gas', 'pharma' or 'all' for all other.
        Separate fields with commas, enclose text containing commas in quotes if needed.
        Only include positive transaction amounts.
        Do not use any markdown backticks or code blocks.
        """

        # Send prompt
        #response = model.generate_content(prompt)

        result = __sumUpCategory()

        redeem_method = request.args.get('redeem_method')
        if redeem_method not in redeem_methods:
            return {"error": "Invalid redeem_method"}, 400
        redeem_method = 'point_' + redeem_method + '_equiv'

        for card in data:
            total = 0.0
            for cat, amount in result.items():
                rate = card['reward_categories'][cat][redeem_method]
                total += amount * rate/100
            card['savings'] = round(total, 2)
            # compute net savings after deducting the monthly fee
            card['net_savings'] = round(card['savings'] - card['annual_fee']/12, 2)

        top3 = sorted(
            data,
            key=lambda c: c['net_savings'],
            reverse=True
        )[:3]

        return {"data": top3}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500

# Calculate total amounts from response.text
def __sumUpCategory():
    amount = {
        "all": 908.07,
        "dining": 161.09,
        "gas": 43.23,
        "grocery": 172.02,
        "online": 625.63,
        "pharma": 0,
        "travel": 430.61
    }

    # Use io.StringIO to treat the CSV text as a file-like object
    #csv_file = io.StringIO(csv_text)
    #reader = csv.DictReader(csv_file)

    # Iterate through each row and sum the "amount" column
    #for row in reader:
        #try:
            # Convert the amount to a float and add to appropriate category
            #category = row.get('category', 'all').lower()
            #if category in amount:
            #    amount[category] += float(row.get('amount', 0))  # Default to 0 if amount is missing
            #else:
            #    amount['all'] += float(row.get('amount', 0))  # Default to 0 if amount is missing
        #except ValueError:
            #print(f"Skipping invalid amount: {row.get('amount', 'N/A')}")  # Handle invalid data

    # Format all values in the amount dictionary to two decimal places
    amount = {key: round(value, 2) for key, value in amount.items()}
    return amount

if __name__ == '__main__':
    app.run(debug=True, port=8000)