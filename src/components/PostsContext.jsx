import { createContext, useState, useContext } from 'react';

// יצירת קונטקסט גלובלי לפוסטים
export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    return (
        <PostsContext.Provider value={{ posts, setPosts }}>
            {children}
        </PostsContext.Provider>
    );
};

// הפונקציה לשימוש בקונטקסט
export const usePosts = () => useContext(PostsContext);