type BaseItem = {
  id: string;
  title: string;
  status: "published" | "draft";
  date: string;
};

type CollectionItem = BaseItem & {
  type: "collection";
  coverImage: string;
};

type FolderItem = BaseItem & {
  type: "folder";
  frontImage: string;
  backImages: string[];
};

type Item = CollectionItem | FolderItem;

export const collections: Item[] = [
  {
    id: "1",
    type: "collection",
    coverImage:
      "https://images.unsplash.com/photo-1655736394091-b1c3efc76a08?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Jhon & Diana",
    status: "published",
    date: "Feb 5, 2025",
  },
  {
    id: "2",
    type: "collection",
    coverImage:
      "https://images.unsplash.com/flagged/photo-1620830102229-9db5c00d4afc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Steve & Jane",
    status: "draft",
    date: "Feb 5, 2025",
  },
  {
    id: "3",
    type: "collection",
    coverImage:
      "https://images.unsplash.com/photo-1628046276142-a614ec8c5504?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Sofia",
    status: "published",
    date: "Feb 5, 2025",
  },
  {
    id: "4",
    type: "collection",
    coverImage:
      "https://images.unsplash.com/photo-1550784718-990c6de52adf?q=80&w=1884&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Franklin & Sara",
    status: "draft",
    date: "Feb 5, 2025",
  },
  {
    id: "5",
    type: "folder",
    title: "Grands Day",
    status: "draft",
    date: "Feb 5, 2025",
    frontImage:
      "https://images.unsplash.com/photo-1739932884695-98a239b8adf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backImages: [
      "https://images.unsplash.com/photo-1739188366834-1281a22a1ac5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1739932900241-4d3362b5ed8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
];
