const listConfig = {
    couchDBUrl: process.env.REACT_APP_DB_URL,
    couchDBAuth: {
        username: process.env.REACT_APP_DB_USERNAME,
        password: process.env.REACT_APP_DB_PASSWORD,
    },
};

export default listConfig;