const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    database: 'postgres',
    password: '2710',
    port: 8000,
});

client.connect();

const getPost = async (id) => {
    const query = 'SELECT * FROM Post WHERE id = ' + id;
    let result = await client.query(query).then(res =>{
        var k = res.rows[0];
        return k;
    })
    return result;
}

const getComments = async (postId) =>{
    const query = 'SELECT * FROM Comments WHERE "id" = ' + postId;
    let result = await client.query(query).then(res =>{
        return res.rows;
    })
    return result;
}


const getPosts = async (left, right) =>{
    const query = 'SELECT * FROM Post WHERE id >= ' + left + ' AND id <= ' + right;
    let result = await client.query(query).then(res => {
        return res.rows;
    });
    return result;
}

const countPosts = async () =>{
    const query = 'SELECT COUNT(*) FROM Post';
    let result = await client.query(query).then(res =>{
        return res;
    })
    console.log(result.rows[0].count - 1);
    return Number(result.rows[0].count) - 1;
}

function addComment(post, comment){

    const query = `INSERT INTO comments ("name", "mail", "sait", "text", "PostId") ` +
        `VALUES ('` + comment.UserName + `','` + comment.Mail + `','` + comment.URL + `','` + comment.Comment_text + `',` + post + `)`;

    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
    });
}

module.exports = { client, getPost, getComments, getPosts, countPosts, addComment}