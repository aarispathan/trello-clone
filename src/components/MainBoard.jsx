import React, { useContext, useState, useRef, useEffect } from 'react';
import { MoreHorizontal, X } from 'react-feather';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BoardContext } from '../context/BoardContext';
import { RiDeleteBin5Fill, RiEdit2Line } from 'react-icons/ri';
import { TbLocationShare } from 'react-icons/tb';
import CardAdd from './CardAdd';
import AddList from './AddList';
import Utils from '../utils/Utils';

const LOCAL_STORAGE_KEY = 'trello-clone-board-data';

const Main = () => {
    const { allboard, setAllBoard } = useContext(BoardContext);
    const [openListMenuId, setOpenListMenuId] = useState(null);
    const [editingCard, setEditingCard] = useState({ listId: null, cardId: null });
    const [editedTitle, setEditedTitle] = useState('');
    const [showShare, setShowShare] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const popupRef = useRef(null);
    const [editingListId, setEditingListId] = useState(null);
    const [editedListTitle, setEditedListTitle] = useState('');
    const bdata = allboard.boards[allboard.active];

    const updateListTitle = (listId, newTitle) => {
        const updatedBoard = { ...allboard };
        const listIndex = updatedBoard.boards[updatedBoard.active].list.findIndex(l => l.id === listId);
        if (listIndex !== -1) {
            updatedBoard.boards[updatedBoard.active].list[listIndex].title = newTitle;
            setAllBoard(updatedBoard);
        }
        setEditingListId(null);
        setEditedListTitle('');
    };


    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allboard));
    }, [allboard]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowShare(false);
            }
        };
        if (showShare) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showShare]);

    const onDragEnd = ({ source, destination }) => {
        if (!destination) return;

        const newList = [...bdata.list];
        const sourceListIndex = newList.findIndex(list => list.id === source.droppableId);
        const destListIndex = newList.findIndex(list => list.id === destination.droppableId);

        const [movedCard] = newList[sourceListIndex].items.splice(source.index, 1);
        newList[destListIndex].items.splice(destination.index, 0, movedCard);

        const updatedBoard = { ...allboard };
        updatedBoard.boards[updatedBoard.active].list = newList;
        setAllBoard(updatedBoard);
    };

    const addCard = (title, listIndex) => {
        if (!title) return;
        const newList = [...bdata.list];
        newList[listIndex].items.push({ id: Utils.makeid(5), title });

        const updatedBoard = { ...allboard };
        updatedBoard.boards[updatedBoard.active].list = newList;
        setAllBoard(updatedBoard);
    };

    const addList = (title) => {
        if (!title) return;
        const newList = [...bdata.list];
        newList.push({ id: Utils.makeid(6), title, items: [] });

        const updatedBoard = { ...allboard };
        updatedBoard.boards[updatedBoard.active].list = newList;
        setAllBoard(updatedBoard);
    };

    const deleteList = (listId) => {
        const updatedBoard = { ...allboard };
        updatedBoard.boards[updatedBoard.active].list = bdata.list.filter(l => l.id !== listId);
        setAllBoard(updatedBoard);
    };

    const updateCardTitle = (listId, cardId, newTitle) => {
        const updatedBoard = { ...allboard };
        const listIndex = updatedBoard.boards[updatedBoard.active].list.findIndex(l => l.id === listId);
        const cardIndex = updatedBoard.boards[updatedBoard.active].list[listIndex].items.findIndex(i => i.id === cardId);
        if (listIndex !== -1 && cardIndex !== -1) {
            updatedBoard.boards[updatedBoard.active].list[listIndex].items[cardIndex].title = newTitle;
            setAllBoard(updatedBoard);
        }
        setEditingCard({ listId: null, cardId: null });
        setEditedTitle('');
    };

    const handleShare = () => {
        if (!shareEmail) return;
        alert(`Shared with ${shareEmail}`);
        setShareEmail('');
        setShowShare(false);
    };

    const deleteCard = (listId, cardId) => {
        const updatedBoard = { ...allboard };
        const listIndex = updatedBoard.boards[updatedBoard.active].list.findIndex(l => l.id === listId);
        if (listIndex !== -1) {
            updatedBoard.boards[updatedBoard.active].list[listIndex].items =
                updatedBoard.boards[updatedBoard.active].list[listIndex].items.filter(i => i.id !== cardId);
            setAllBoard(updatedBoard);
        }
    };


    return (
        <div
            className="flex flex-col rounded-md m-1 h-[calc(100vh-3rem)] w-full"
            style={{ backgroundColor: bdata.bgcolor }}
        >
            <div className="p-3 bg-white/10 backdrop-blur-lg border-none rounded-md flex justify-between items-center w-full">
                <h2 className="text-lg text-white">{bdata.name}</h2>
                <div className="relative">
                    <button onClick={() => setShowShare(true)} className="bg-white text-gray-800 px-2 py-1 h-8 rounded flex items-center">
                        <TbLocationShare size={16} className="mr-2" /> Share
                    </button>
                    {showShare && (
                        <div ref={popupRef} className="absolute top-12 right-0 bg-[#1d1f22] p-4 rounded-md shadow-lg w-64 text-white border border-white/20 z-20">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-base font-semibold">Share Board</h4>
                                <button onClick={() => setShowShare(false)} className="hover:text-red-400">
                                    <X size={16} />
                                </button>
                            </div>
                            <input
                                type="email"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full p-2 bg-zinc-800 text-white rounded mb-3 outline-none"
                            />
                            <button onClick={handleShare} className="w-full bg-sky-600 hover:bg-sky-700 text-white p-2 rounded">
                                Send Invite
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 overflow-y-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-3">
                        {bdata.list.map((list, listIndex) => (
                            <div
                                key={list.id}
                                className="bg-black rounded-md p-2 h-fit"
                            >
                                <div className="flex justify-between items-center mb-2 relative">
                                    {editingListId === list.id ? (
                                        <input
                                            type="text"
                                            className="bg-zinc-800 text-white text-sm p-1 rounded w-full outline-none mr-2"
                                            value={editedListTitle}
                                            autoFocus
                                            onChange={(e) => setEditedListTitle(e.target.value)}
                                            onBlur={() => updateListTitle(list.id, editedListTitle)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') updateListTitle(list.id, editedListTitle);
                                            }}
                                        />
                                    ) : (
                                        <span className="text-white font-medium text-sm sm:text-base">
                                            {list.title}
                                        </span>
                                    )}

                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenListMenuId((prev) => (prev === list.id ? null : list.id))
                                            }
                                            className="hover:bg-gray-500 p-1 rounded-sm"
                                        >
                                            <MoreHorizontal size={16} className="text-white" />
                                        </button>

                                        {openListMenuId === list.id && (
                                            <div className="absolute right-0 top-full mt-1 bg-zinc-900 text-white rounded shadow-lg z-20 p-2 w-32">
                                                <button
                                                    onClick={() => {
                                                        setEditingListId(list.id);
                                                        setEditedListTitle(list.title);
                                                        setOpenListMenuId(null);
                                                    }}
                                                    className="flex justify-between gap-2 items-center w-full text-xs sm:text-sm text-blue-400 hover:text-blue-500"
                                                >
                                                    Edit Title <RiEdit2Line size={16} />
                                                </button>
                                                <hr className="my-1 border-white" />
                                                <button
                                                    onClick={() => {
                                                        deleteList(list.id);
                                                        setOpenListMenuId(null);
                                                    }}
                                                    className="flex justify-between gap-2 items-center w-full text-xs sm:text-sm text-red-400 hover:text-red-500"
                                                >
                                                    Delete <RiDeleteBin5Fill size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Droppable droppableId={list.id.toString()}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`space-y-2 pb-2 min-h-[50px] ${snapshot.isDraggingOver ? 'bg-zinc-800' : ''}`}
                                        >
                                            <div className="grid grid-cols-1 gap-2">
                                                {list.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-2 border rounded-md flex justify-between items-center gap-2 cursor-pointer 
        ${snapshot.isDragging ? 'bg-zinc-600 border-gray-500' : 'bg-zinc-700 border-zinc-900 hover:border-gray-500'}
        text-xs sm:text-sm`}
                                                            >
                                                                {editingCard.listId === list.id && editingCard.cardId === item.id ? (
                                                                    <input
                                                                        type="text"
                                                                        className="bg-zinc-800 text-white text-xs sm:text-sm p-1 rounded w-full outline-none"
                                                                        value={editedTitle}
                                                                        autoFocus
                                                                        onChange={(e) => setEditedTitle(e.target.value)}
                                                                        onBlur={() => updateCardTitle(list.id, item.id, editedTitle)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') updateCardTitle(list.id, item.id, editedTitle);
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <span className="text-white flex-1 truncate">{item.title}</span>
                                                                        <div className='flex gap-2 items-center'>
                                                                            <button
                                                                                onClick={() => {
                                                                                    deleteCard(list.id, item.id);
                                                                                }}
                                                                            >
                                                                                <RiDeleteBin5Fill size={18} className="text-red-400 hover:text-red-500" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingCard({ listId: list.id, cardId: item.id });
                                                                                    setEditedTitle(item.title);
                                                                                }}
                                                                            >
                                                                                <RiEdit2Line size={18} className="text-blue-400 hover:text-blue-500" />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                        )}
                                                    </Draggable>
                                                ))}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <CardAdd
                                    getcard={(cardTitle) => addCard(cardTitle, listIndex)}
                                    mobileClass="text-xs sm:text-sm"
                                />
                            </div>
                        ))}

                        <AddList
                            getlist={addList}
                            className="bg-black rounded-md p-2 h-fit min-w-[240px]"
                        />
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Main;
