import { init_server } from "./app/app";
import cors from "cors";

async function init() {
    const app = await init_server();
    app.use(cors());
    
    app.listen(8000, () => {
        console.log("🚀 Server is live at localhost:8000");
    });
}

init();