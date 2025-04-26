from flask import Flask, request, jsonify
import psycopg2 # postgres driver
import os
from dotenv import load_dotenv
from datetime import datetime  # Import datetime for current date

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
cur = conn.cursor()
cur.execute('SELECT version()')
print(cur.fetchone())

# set constants
categories = {cat: True for cat in ['travel', 'dining', 'grocery', 'gas', 'all']}
redeem_methods = {method: True for method in ['cashback', 'travel', 'giftcard']}

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return "<p>ping</p>"

@app.route('/api/card-img', methods=['GET'])
def get_card_img():
    try:
        # Execute SQL query to fetch card_id and img_url from cards table
        cur.execute("SELECT card_id, img_url FROM cards")
        rows = cur.fetchall()  # Fetch all rows from the result

        # Format the result as JSON
        data = [{"card_id": row[0], "img_url": row[1]} for row in rows]
        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Return error message with HTTP 500 status

@app.route('/api/user/card', methods=['GET'])
def get_user_cards():
    try:
        # Get the user_id from query parameters
        user_id = request.args.get('user_id')

        # Validate input
        if not user_id:
            return {"error": "Missing user_id"}, 400  # Bad Request

        # Execute SQL query to fetch all cards for the given user_id, including date_added
        cur.execute(
            "SELECT uc.card_id, c.card_name, c.card_type, c.img_url, uc.date_added "
            "FROM user_cards uc "
            "JOIN cards c ON uc.card_id = c.card_id "
            "WHERE uc.user_id = %s",
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
                "date_added": row[4].strftime('%Y-%m-%d') if row[4] else None
            }
            for row in rows
        ]

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Internal Server Error

@app.route('/api/user/card', methods=['POST'])
def add_user_card():
    try:
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
                "reward_equiv": row[3],
                "cashback_pct": row[4],
                "point_mul": row[5],
                "category": row[6],
                "rank": row[7],
            }
            for row in rows
        ]

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Internal Server Error

@app.route('/api/card/ranking', methods=['GET'])
def get_cards_ranking():
    try:
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
                "reward_equiv": row[3],
                "cashback_pct": row[4],
                "point_mul": row[5],
                "rank": row[6],
            }
            for row in rows
        ]

        return {"data": data}, 200  # Return JSON response with HTTP 200 status
    except Exception as e:
        return {"error": str(e)}, 500  # Internal Server Error

if __name__ == '__main__':
    app.run(debug=True)