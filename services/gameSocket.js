const { Server } = require("socket.io");
const { Controller } = require("../controllers/controller");

function setupGameSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Ganti dengan URL frontend Anda
            methods: ["GET", "POST"],
        },
    });

    let waitingPlayer = null;
    let games = [];

    io.on("connection", (socket) => {
        console.log(`Player connected: ${ socket.id }`);

        socket.on("join", async ({ style }) => {
            if (!waitingPlayer) {
                waitingPlayer = { socket, style };
                socket.emit("waiting", { message: "Waiting for another player..." });
            } else {
                const player1 = waitingPlayer;
                const player2 = { socket };
                waitingPlayer = null;

                const game = { player1, player2, paragraph: null, counters: { player1: 0, player2: 0 } };
                games.push(game);

                try {
                    const req = { body: { style: player1.style } };
                    const res = {
                        status: () => ({
                            json: (data) => {
                                game.paragraph = data.data;
                                [player1, player2].forEach((player) =>
                                    player.socket.emit("start", { paragraph: game.paragraph })
                                );

                                let countdown = 5;
                                const countdownInterval = setInterval(() => {
                                    [player1, player2].forEach((player) =>
                                        player.socket.emit("countdown", { countdown })
                                    );
                                    if (--countdown < 0) {
                                        clearInterval(countdownInterval);
                                        [player1, player2].forEach((player) =>
                                            player.socket.emit("gameStart", { duration: 180 })
                                        );

                                        setTimeout(() => endGame(game), 180000);
                                    }
                                }, 1000);
                            },
                        }),
                    };
                    await Controller.generateText(req, res);
                } catch {
                    [player1, player2].forEach((player) =>
                        player.socket.emit("error", { message: "Failed to generate paragraph." })
                    );
                }
            }
        });

        socket.on("counter", ({ counter }) => {
            const game = games.find((g) => g.player1.socket === socket || g.player2.socket === socket);
            if (game) {
                const playerKey = game.player1.socket === socket ? "player1" : "player2";
                game.counters[playerKey] = counter;
            }
        });

        socket.on("disconnect", () => {
            console.log(`Player disconnected: ${ socket.id }`);
            if (waitingPlayer?.socket === socket) waitingPlayer = null;

            const game = games.find((g) => g.player1.socket === socket || g.player2.socket === socket);
            if (game) {
                const opponent = game.player1.socket === socket ? game.player2.socket : game.player1.socket;
                opponent.emit("gameEnd", {
                    status: "Winner",
                    score: game.counters[opponent === game.player1.socket ? "player1" : "player2"] * 10,
                });
                games = games.filter((g) => g !== game);
            }
        });
    });

    function endGame(game) {
        const { player1, player2, counters } = game;
        const results = calculateResults(counters);
        player1.socket.emit("gameEnd", results.player1);
        player2.socket.emit("gameEnd", results.player2);
        games = games.filter((g) => g !== game);
    }

    function calculateResults(counters) {
        const scores = {
            player1: counters.player1 * 10,
            player2: counters.player2 * 10,
        };
        const status = scores.player1 > scores.player2
            ? { player1: "Winner", player2: "Loser" }
            : scores.player2 > scores.player1
                ? { player1: "Loser", player2: "Winner" }
                : { player1: "Draw", player2: "Draw" };

        return {
            player1: { status: status.player1, score: scores.player1 },
            player2: { status: status.player2, score: scores.player2 },
        };
    }
}

module.exports = setupGameSocket;