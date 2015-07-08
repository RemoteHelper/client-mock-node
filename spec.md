## Requesting Remote Help

We send the Server the url of our media, and the hook where we wish to receive the events.

- Request:
    - URL: `server/help/image`
    - Type: `POST`
    - Content:

    ```json
    {
            media: url | bytes,
            eventsURL: url
    }
    ```

The server responds with the unique URL served to the user, and a specific route where the server is listening for

- Response:
    - Status: `200`
    - Body:

        ```json
        {
            userURL: url,
            doneURL: url,
        }
        ```

## Sending events to the client

- Request:
    - URL: `client/eventsURL`
    - Type: `POST`
    - Body:

    ```json
    {
        type: String
        content: {}
    }
    ```

- Response:
    - Status: `100`

## Telling the Server that we are done

- Request:
    - URL: `server/doneURL`
    -  Type: `POST`
    -  Body:

    ```json
    {
        authURL: userUrl
    }
    ```

- Response:
    - Status: `200` | `403`
