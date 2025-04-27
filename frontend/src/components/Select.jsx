'use client'

import { useState } from 'react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

export default function Select({ methods, selected, setSelected, label }) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div>
      <Label className="block text-sm/6 font-medium">{label}</Label>
      <div className="relative mt-2 bg-transparent">
        {/* <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"> */}
        <ListboxButton className="box-shadowing grid w-full cursor-pointer grid-cols-1 rounded-xl backdrop-blur-lg py-2 pr-10 pl-3 text-left outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm">

          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6 ">
            {selected?.img_url && (
                  <img
                    alt=""
                    src={selected.img_url}
                    className="size-10 shrink-0"
                  />
                )}
            {selected ? (
                <span className="block truncate">{selected.name}</span>
              ) : (
                <span className="block truncate text-gray-400">Select a method</span>
              )}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {methods.map((person) => (
            <ListboxOption
              key={person.id}
              value={person}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
            >
              <div className="flex items-center">
                {person.img_url && (
                    <img
                      alt=""
                      src={person.img_url}
                      className="size-10 shrink-0 "
                    />
                  )}
                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{person.name}</span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
      </div>
    </Listbox>
  )
}
