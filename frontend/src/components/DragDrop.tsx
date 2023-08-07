import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { lessonActions } from "@redux/slice";
import { orderLesson } from "../types/lesson";
import { sectionActions } from "@redux/slice";

type DragProps = {
    initialItems: JSX.Element[];
    role: boolean;
};

const LESSON_ID = 0;

const DragDrop: React.FC<DragProps> = (props) => {
    const [items, setItems] = useState<JSX.Element[]>(props.initialItems);
    const lessonOrderSelector = useAppSelector((state) => state.sectionSlice.orderLesson);
    const dispatch = useAppDispatch();
    let orderItems: JSX.Element[] = [];
    lessonOrderSelector.forEach((orderId: orderLesson) => {
        let temp = items.filter((item) => orderId.lesson_id == item.key)[0];
        if (temp) {
            orderItems.push(temp);
        }
    });
    useEffect(() => {
        setItems(props.initialItems);
    }, [props.initialItems]);

    const onDragEnd = (result: DropResult) => {
        const actionOrder = result.draggableId.split("-");
        if (result.destination?.index !== result.source.index) {
            const lesson_id: number = parseInt(actionOrder[LESSON_ID]);
            const indexInSelector: number = lessonOrderSelector.findIndex(
                (item: orderLesson) => item?.lesson_id === lesson_id
            );
            const oldOrder: number = indexInSelector;
            const oldIndex: number = result.source.index;
            const newIndex: number = result.destination?.index as number;
            const step = newIndex - oldIndex;
            const newOrder = oldOrder + step;
            const reOrder = {
                oldOrder: oldOrder,
                id: lesson_id,
                newOrder: newOrder,
            };
            dispatch(sectionActions.reOrder(reOrder));
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
                            {orderItems.map((item, index) => {
                                return (
                                    <Draggable
                                        isDragDisabled={props.role}
                                        key={`items-${index}`}
                                        draggableId={`${item.key}-${index}`}
                                        index={index}
                                    >
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
