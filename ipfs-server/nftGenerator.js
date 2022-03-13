require("dotenv").config();
const { createCanvas, loadImage } = require("canvas");
const { Chess } = require("chess.js");
const getBlurredProgression = require("./utils/getBlurredProgression");

const { saveImageFromCanvas, saveImageFromBuffer } = require("./utils/saveImage");

const { convert } = require("convert-svg-to-png");
const pseudoRandom = require("pseudo-random");

const { NFTStorage, File } = require("nft.storage");
const client = new NFTStorage({ token: process.env.NFT_API_KEY });

function getSVGFromText(text, { fontSize, width, height, lineHeight = 19, color, fontFamily }) {
    return `
		<svg xmlns='http://www.w3.org/2000/svg' width=${width} height=${height}>
			<foreignObject width='100%' height='100%'>
				<div xmlns='http://www.w3.org/1999/xhtml' 
				style='font-size:${fontSize}px; text-align:justify;
				line-height:${lineHeight}px; color:${color};
				font-family:${fontFamily};'>
				${text}
				</div>
			</foreignObject>
		</svg>`;
}

const random_hex_color = num => {
    let n = (num * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
};

const getNFT = async (gameId, pgn, outcome, w, b) => {
    try {
        const chess = new Chess();

        chess.load_pgn(pgn);
        let ph = chess.history({ verbose: true });

        const lmPiece = ph[ph.length - 1].piece;
        const lmove = ph[ph.length - 1];
        const whiteORblack = outcome == 3 ? 0 : 1;
        // console.log(whiteORblack);

        var crypto = require("crypto");
        var hash = crypto
            .createHash("sha256")
            .update(pgn + gameId)
            .digest("hex");
        var seed = parseInt(BigInt("0x" + hash) % BigInt(10000000000));
        const prng = pseudoRandom(seed);

        scheme = {
            w: {
                p: random_hex_color(prng.random()),
                q: random_hex_color(prng.random()),
                k: random_hex_color(prng.random()),
                n: random_hex_color(prng.random()),
                b: random_hex_color(prng.random()),
                r: random_hex_color(prng.random()),
            },
            b: {
                p: random_hex_color(prng.random()),
                q: random_hex_color(prng.random()),
                k: random_hex_color(prng.random()),
                n: random_hex_color(prng.random()),
                b: random_hex_color(prng.random()),
                r: random_hex_color(prng.random()),
            },
        };

        const progressionLayerBuffer = await getBlurredProgression(pgn);
        // saveImageFromBuffer(progressionLayerBuffer, "progressionLayer");

        const frame = createCanvas(1080, 1080);
        const frameCtx = frame.getContext("2d");
        const frame2 = createCanvas(1080, 1080);
        const frame2Ctx = frame2.getContext("2d");
        const framePiece = createCanvas(1080, 1080);
        const framePieceCtx = framePiece.getContext("2d");

        if (whiteORblack == 0) {
            frameCtx.fillStyle = "#FCF5F5";
            frameCtx.rect(0, 0, 1080, 1080);
            frameCtx.fill();
        } else {
            frameCtx.fillStyle = "#353842";
            frameCtx.rect(0, 0, 1080, 1080);
            frameCtx.fill();
        }

        let progressionLayer = await loadImage(progressionLayerBuffer);
        frameCtx.drawImage(await progressionLayer, 28, 28, 224, 224);

        let mask = await loadImage(`./inputs/${lmPiece}_bg_${whiteORblack}.png`);
        frame2Ctx.drawImage(await mask, 0, 0);
        frame2Ctx.globalCompositeOperation = "source-in";
        let pieceMask = progressionLayer;
        frame2Ctx.drawImage(await pieceMask, 0, 0);
        // saveImageFromCanvas(frame2, "pieceMask");

        const smallPgnTextSVG = getSVGFromText(pgn, {
            fontSize: 16,
            width: 224,
            height: 780,
            lineHeight: 19,
            color: whiteORblack == 0 ? "#979393" : "#D0CBCE",
            fontFamily: "Roboto, sans-serif",
        });

        const smallPgnTextImageBuffer = await convert(smallPgnTextSVG);

        let img = loadImage(smallPgnTextImageBuffer);
        frameCtx.drawImage(await img, 28, 272, 224, 780);

        const bgPgnTextSVG = getSVGFromText(pgn, {
            fontSize: 78,
            width: 760,
            height: 1027,
            lineHeight: 104,
            color: whiteORblack == 0 ? "#E3DDDD" : "#505568",
            fontFamily: "Noto Serif, serif",
        });

        const bgPgnTextImageBuffer = await convert(bgPgnTextSVG);

        img = loadImage(bgPgnTextImageBuffer);
        frameCtx.drawImage(await img, 280, 22, 760, 1027);

        let piece_bg = loadImage(`./inputs/${lmPiece}_bg_${whiteORblack}.png`);
        frameCtx.drawImage(await piece_bg, 263, 263, 780, 780);

        let piece_ = await loadImage(frame2.toBuffer("image/png"));
        frameCtx.drawImage(await piece_, 263, 263, 780, 780);

        let piece_fg = loadImage(`./inputs/${lmPiece}_fg_${whiteORblack}.png`);
        frameCtx.drawImage(await piece_fg, 263, 263, 780, 780);
        const NFT = frame.toBuffer("image/png");
        // saveImageFromCanvas(frame, "NFT");

        let piece_skin_bg = loadImage(`./inputs/${lmPiece}_bg_${whiteORblack}.png`);
        framePieceCtx.drawImage(await piece_skin_bg, 55, 55, 970, 970);

        let piece_skin = await loadImage(frame2.toBuffer("image/png"));
        framePieceCtx.drawImage(await piece_skin, 55, 55, 970, 970);

        let piece_skin_fg = loadImage(`./inputs/${lmPiece}_fg.png`);
        framePieceCtx.drawImage(await piece_skin_fg, 55, 55, 970, 970);
        const pieceSkin = framePiece.toBuffer("image/png");
        // saveImageFromCanvas(framePiece, "pieceSkin");

        const pieceMap = {
            q: "Queen",
            k: "King",
            n: "Knight",
            b: "Bishop",
            r: "Rook",
            p: "Pawn",
        };

        const nftData = {
            name: `Shatranj ${gameId}`,
            description: pgn,
            minted_at: new Date().toGMTString(),
            attributes: [
                {
                    trait_type: "White Player",
                    value: w,
                },
                {
                    trait_type: "Black Player",
                    value: b,
                },
                {
                    trait_type: "Winner",
                    value: outcome == 3 ? "White" : "Black",
                },
                {
                    trait_type: "Moves",
                    value: ph.length,
                },
                {
                    trait_type: "Last Moved Piece",
                    value: `${lmove.color == "w" ? "White" : "Black"} ${pieceMap[lmPiece]}`,
                },
                {
                    trait_type: "Last Move",
                    value: lmove.from + " - " + lmove.to,
                },
                {
                    display_type: "number",
                    trait_type: "Generation",
                    value: 1,
                },
            ],
            image: new File([NFT], `Shatranj.png`, { type: "image/png" }),
            piece: new File([pieceSkin], `${lmove.color}${lmPiece.toUpperCase()}.png`, {
                type: "image/png",
            }),
        };
        // console.log(nftData);

        const NFTmetadata = await client.store(nftData);
        // console.log(NFTmetadata);
        return NFTmetadata.ipnft;
    } catch (error) {
        console.log(error);
    }
};

module.exports = getNFT;
