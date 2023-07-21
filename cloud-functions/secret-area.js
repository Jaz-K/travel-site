exports.handler = function (event, context, callback) {
    const secretContent = `
    <h3>Welcome to the Secret Area</h3>
    <p>Here we can tell you the sky is <strong>blue</strong> and two plus two is equals to four </p>
    `;

    let body;
    let password = "javascript";

    if (event.body) {
        body = JSON.parse(event.body);
    } else {
        body = {};
    }

    if (body.password == password) {
        callback(null, {
            statusCode: 200,
            body: secretContent,
        });
    } else {
        callback(null, {
            statusCode: 401,
        });
    }
};
