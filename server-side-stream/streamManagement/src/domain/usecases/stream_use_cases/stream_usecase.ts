import { generateToken04 } from "../../../data/Adapters/server/zegoServerAssistant";
import { usecase_interface_stream } from "../../interfaces/stream_interface/usecase_stream";



class usecase_stream implements  usecase_interface_stream{
    constructor() {
        // generateToken04
    }
}
 

export const usecaseStream:usecase_interface_stream = new usecase_stream()


// const appID = ; 
// const serverSecret = ;
// const userId = 'user1'; 
// const effectiveTimeInSeconds = 3600;  
// const payload = '';  
// const token =  generateToken04(appID, userId, serverSecret, effectiveTimeInSeconds, payload);
// console.log('token:',token);
