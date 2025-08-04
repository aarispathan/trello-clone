import React, { useContext, useState } from 'react';
import { Plus, X } from 'react-feather';
import { BoardContext } from '../context/BoardContext';
import { RiMenuFill, RiCloseLargeFill, RiDeleteBin2Fill, RiEdit2Line } from "react-icons/ri";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
    const blankBoard = {
        name: '',
        bgcolor: '#f60000',
        list: [],
    };

    const [boardData, setBoardData] = useState(blankBoard);
    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { allboard, setAllBoard } = useContext(BoardContext);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedBoardName, setEditedBoardName] = useState('');

    const setActiveBoard = (i) => {
        const updatedBoard = { ...allboard, active: i };
        setAllBoard(updatedBoard);
    };

    const addBoard = () => {
        console.log("Creating board:", boardData);
        if (!boardData.name.trim()) {
            toast.warn('Please enter a board title!');
            return;
        }

        const newBoard = {
            name: boardData.name,
            bgcolor: boardData.bgcolor,
            list: [],
        };

        const updatedBoards = [...allboard.boards, newBoard];
        const updatedBoard = {
            boards: updatedBoards,
            active: updatedBoards.length - 1,
        };

        console.log("Updated AllBoard:", updatedBoard);
        setAllBoard(updatedBoard);
        setBoardData(blankBoard);
        setIsModalOpen(false);

        toast.success('Board created!');
    };

    const deleteBoard = (indexToDelete) => {
        const updatedBoards = allboard.boards.filter((_, i) => i !== indexToDelete);

        if (updatedBoards.length === 0) {
            toast.error("At least one board is required!", {
                position: "bottom-left",
                autoClose: 2000,
            });
            return;
        }

        const newActive =
            indexToDelete === allboard.active
                ? 0
                : indexToDelete < allboard.active
                    ? allboard.active - 1
                    : allboard.active;

        setAllBoard({ boards: updatedBoards, active: newActive });

        toast.success("Board deleted successfully!", {
            position: "bottom-left",
            autoClose: 2000,
        });
    };

    const handleEditBoard = (index, name) => {
        setEditingIndex(index);
        setEditedBoardName(name);
    };

    const handleSaveEdit = (index) => {
        if (!editedBoardName.trim()) {
            toast.warn('Board name cannot be empty!', {
                position: "bottom-left",
                autoClose: 2000,
            });
            return;
        }

        const updatedBoards = [...allboard.boards];
        updatedBoards[index].name = editedBoardName;
        setAllBoard({ ...allboard, boards: updatedBoards });

        setEditingIndex(null);
        setEditedBoardName('');

        toast.success('Board name updated!', {
            position: "bottom-left",
            autoClose: 2000,
        });
    };

    return (
        <div
            className={`${collapsed ? 'relative w-[60px] md:relative' : 'absolute w-[280px] md:relative'
                } z-20 bg-[#121417] h-[calc(100vh-3rem)] border-r m-1 rounded-md border-[#9fadbc29] transition-all duration-300 flex-shrink-0`}
        >
            <ToastContainer />
            {collapsed ? (
                <div className="py-4 px-4 flex justify-between items-center">
                    <button
                        onClick={() => setCollapsed(false)}
                        className="hover:bg-slate-600 rounded-sm"
                    >
                        <RiMenuFill size={24} className="text-white" />
                    </button>
                </div>
            ) : (
                <div className="px-3 py-2">
                    <div className="py-3 flex justify-between items-center border-b border-[#9fadbc29]">
                        <h4 className="text-white text-base font-semibold">Trello Clone Workspace</h4>
                        <button
                            onClick={() => setCollapsed(true)}
                            className="hover:bg-slate-600 rounded-sm p-1"
                        >
                            <RiCloseLargeFill size={18} className="text-white" />
                        </button>
                    </div>
                    <div className="mt-3 relative">
                        <h6 className="text-gray-300 text-sm font-medium mb-1">Your Boards</h6>
                        <ul className="text-sm text-white space-y-1">
                            {allboard.boards.map((board, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between hover:bg-gray-600 rounded px-2"
                                >
                                    {editingIndex === i ? (
                                        <input
                                            type="text"
                                            value={editedBoardName}
                                            onChange={(e) => setEditedBoardName(e.target.value)}
                                            onBlur={() => handleSaveEdit(i)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(i)}
                                            className="bg-zinc-800 text-white outline-none bg-transparent p-1 rounded text-sm w-full mr-2"
                                            autoFocus
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setActiveBoard(i)}
                                            className="flex items-center py-2 w-full text-left flex-grow"
                                        >
                                            <span
                                                className="w-5 h-5 border-2 border-white rounded-sm mr-2 inline-block"
                                                style={{ backgroundColor: board.bgcolor }}
                                            />

                                            <span>{board.name}</span>
                                        </button>
                                    )}

                                    <div className="flex gap-2 ml-2">
                                        <button
                                            onClick={() => handleEditBoard(i, board.name)}
                                            className="text-green-300 hover:text-green-500"
                                            title="Edit board"
                                        >
                                            <RiEdit2Line size={16} />
                                        </button>
                                        {allboard.boards.length > 1 && (
                                            <button
                                                className="text-red-400 hover:text-red-600"
                                                title="Delete board"
                                                onClick={() => deleteBoard(i)}
                                            >
                                                <RiDeleteBin2Fill size={16} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="relative mt-3">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="hover:bg-slate-600 text-white p-1 rounded-sm flex items-center w-full justify-center space-x-2"
                            >
                                <span>Add New Board</span>
                                <Plus size={16} />
                            </button>

                            {isModalOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                                    <div className="w-80 bg-slate-600 text-white rounded p-4 relative">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="absolute right-2 top-2 text-white hover:bg-gray-500 p-1 rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                        <h4 className="text-lg font-semibold mb-2">Create Board</h4>
                                        <div className="mt-4 space-y-2">
                                            <label htmlFor="boardName" className="block text-sm font-medium">
                                                Board Title <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                id="boardName"
                                                name="boardName"
                                                type="text"
                                                value={boardData.name}
                                                onChange={(e) => setBoardData({ ...boardData, name: e.target.value })}
                                                onKeyDown={(e) => e.key === 'Enter' && addBoard()}
                                                className="h-8 px-2 w-full bg-gray-700 rounded outline-none"
                                            />

                                            <label className="block text-sm font-medium mb-1">Board Color</label>
                                            <div role="radiogroup" aria-label="Board Color" className="flex flex-wrap gap-2 mt-1">
                                                {["#3e96F4", "#81654F", "#AA75B8", "#708090", "#1D3727", "#949A89", "#A39FE1", "#B1AE9F"].map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => setBoardData({ ...boardData, bgcolor: color })}
                                                        className={`w-6 h-6 rounded-full border-2 ${boardData.bgcolor === color ? 'border-white' : 'border-transparent'}`}
                                                        style={{ backgroundColor: color }}
                                                        title={`Select ${color}`}
                                                        aria-label={`Select ${color}`}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                onClick={addBoard}
                                                className="w-full h-8 mt-2 rounded bg-slate-700 hover:bg-gray-500 transition"
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;