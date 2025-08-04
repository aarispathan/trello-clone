import React, { useState } from 'react';
import { X, Plus } from 'react-feather';
import { GoPlus } from "react-icons/go";

const AddList = ({ getlist }) => {
    const [list, setList] = useState('');
    const [show, setShow] = useState(false);

    const handleSave = () => {
        if (!list.trim()) return;
        getlist(list.trim());
        setList('');
        setShow(false);
    };

    const handleClose = () => {
        setList('');
        setShow(false);
    };

    return (
        <div className="flex flex-col h-fit flex-shrink-0 mr-3 w-60 rounded-md p-2 bg-black">
            {show ? (
                <div className="space-y-2">
                    <textarea
                        value={list}
                        onChange={(e) => setList(e.target.value)}
                        className="w-full p-2 rounded-md border-2 bg-zinc-700 border-zinc-900 text-white"
                        placeholder="Enter list title..."
                        rows={2}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
                        >
                            Add List
                        </button>
                        <button
                            onClick={handleClose}
                            className="hover:bg-gray-600 p-1 rounded"
                            title="Cancel"
                        >
                            <GoPlus size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShow(true)}
                    className="flex items-center justify-center w-full space-x-2 text-sm text-white hover:bg-gray-500 px-2 py-1 rounded h-8"
                >
                    <GoPlus size={20} />
                    <span>Add a list</span>
                </button>
            )}
        </div>
    );
};

export default AddList;