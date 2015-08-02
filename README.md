# client-mock-node
A very dumb client implementation for testing the [RemoteHelper][remote-helper], in Node.js.

## Usage
This client implements
a simple use case of the [RemoteHelper][remote-helper].
For it to work properly,
the [RemoteHelper][remote-helper] must already be running.

You can configure where this client
is supposed to look for the [RemoteHelper][remote-helper]
in [the config file](./config.json).

Start the client by running
`node server.js`.
This will create an HTTP server
which receives events from the [RemoteHelper][remote-helper]
and responds to them,
and it will also issue an image help request
to the RemoteHelper.

The use case implemented is the following:
the client listens for a total of 10 events
(for instance, 5 mouse clicks --
each one triggers `mouseup` and `mousedown`)
and then tells the [RemoteHelper][remote-helper]
that the help job is done.
In addition, for `mouseup` events,
if the click is on the upper-right side
of the screen,
it sends a new `mediaURL` (a new image)
for the [RemoteHelper][remote-helper] to update the static page.


[remote-helper]: https://github.com/RemoteHelper/server
