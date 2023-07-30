import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useAppDispatch } from "../hooks/hooks";
import { sectionActions } from "@redux/slice";

type DragProps = {
    initialItems: JSX.Element[];
    status: number;
};

const DragDrop: React.FC<DragProps> = (props) => {
    const [items, setItems] = useState<JSX.Element[]>(props.initialItems);
    const dispatch = useAppDispatch();
    const onDragEnd = (result: DropResult) => {
        const actionOrder = result.draggableId.split("-");
        if (result.destination?.index !== parseInt(actionOrder[2])) {
            const lesson_id: number = parseInt(actionOrder[0]);
            const oldOrder: number = parseInt(actionOrder[1]);
            const oldIndex: number = parseInt(actionOrder[2]);
            const newIndex: number = result.destination?.index ? result.destination?.index : 0;
            const step = newIndex - oldIndex;
            const isIncrement = step > 0 ? -1 : 1;
            const newOrder = oldOrder + step;
            dispatch(sectionActions.reOderLesson([lesson_id, newOrder, oldOrder, isIncrement]));
        }
        if (!result.destination) {
            return;
        }
        const newItems = [...items];
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        setItems(newItems);
    };

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="items">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, index) => {
                                return (
                                    <Draggable key={`item-${index}`} draggableId={`${item.key}-${index}`} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                {item}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default DragDrop;
