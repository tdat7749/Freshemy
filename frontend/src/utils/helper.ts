export const previewImage = (image: File | null, imageRef: React.RefObject<HTMLImageElement>, imageSource?: string) => {
    if (image && image.type.includes("image/")) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (imageRef.current) {
                imageRef.current.src = e.target?.result as string;
            }
        };
        reader.readAsDataURL(image);
        return;
    } else {
        if (imageRef.current && imageSource) {
            imageRef.current.src = imageSource;
        } else if (imageRef.current) {
            imageRef.current.src = "";
        }
    }
};

export const eveluateList = [
    {
        title: "5 stars",
        value: 5,
    },
    {
        title: "4 stars",
        value: 4,
    },
    {
        title: "3 stars",
        value: 3,
    },
    {
        title: "2 stars",
        value: 2,
    },
    {
        title: "1 star",
        value: 1,
    },
];

export const sortingBy = [
    {
        value: "newest",
        title: "Newest",
    },
    { value: "mostAttendees", title: "Most Attendees" },
];
