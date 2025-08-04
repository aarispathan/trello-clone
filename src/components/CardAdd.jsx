import React, { useState } from 'react';
import { GoPlus } from "react-icons/go";

const CardAdd = ({ getcard }) => {
    const [card, setCard] = useState('');
    const [show, setShow] = useState(false);

    const handleSave = () => {
        if (!card.trim()) return;
        getcard(card.trim());
        setCard('');
        setShow(false);
    };

    const handleClose = () => {
        setCard('');
        setShow(false);
    };

    return (
        <div className="flex flex-col mt-2">
            {show ? (
                <div className="space-y-2">
                    <textarea
                        value={card}
                        onChange={(e) => setCard(e.target.value)}
                        className="w-full p-2 rounded-md border-2 border-zinc-900 bg-zinc-700 text-white"
                        placeholder="Enter card title..."
                        rows={2}
                    ></textarea>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
                        >
                            Add Notes
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
                    className="flex items-center space-x-1 w-full text-sm text-white hover:bg-gray-500 px-2 py-1 rounded"
                >
                    <GoPlus size={20} />
                    <span>Add Notes</span>
                </button>
            )}
        </div>
    );
};

export default CardAdd;
