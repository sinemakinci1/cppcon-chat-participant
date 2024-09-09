import { renderPrompt } from '@vscode/prompt-tsx';
import * as vscode from 'vscode';
import { PlayPrompt } from './play';
import { cppconSchedule } from './schedule-context';

const CPPCON_PARTICIPANT_ID = 'chat-sample.cppcon';

interface ICppConChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: 'copilot', family: 'gpt-4o' };

export function activate(context: vscode.ExtensionContext) {
    // Register a chat participant that can respond to user queries
    const cppconParticipant = vscode.chat.createChatParticipant(CPPCON_PARTICIPANT_ID, async (request, context, response, token) => {
        const userQuery = request.prompt;

        const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
        if (!model) {
            response.markdown('Sorry I couldn\'t complete the request.');
            return;
        }
        //Only provide a CppCon agent response if someone asks about the schedule
        if (userQuery.includes('schedule') || userQuery.includes('session') || userQuery.includes('talk')) {
            const messages = [
                new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, 'You must look through the schedule provided and give a response according to what the user is asking for. Please search through the schedule data and provide the relevant talks for the question I ask. Please notice that each day has a separate list of talks below each day market. The schedule info is provided below'),
                new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, cppconSchedule),
                new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, 'I want to learn more about the CppCon talks. Answer my question normally like a chat agent, but use the schedule info above where applicable to answer it. If i request cppcon talks at a given time, give me the CppCon schedule for the times. If I ask for talks on a subject, give me a list of talks on that subject.'),
                new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, userQuery)
            ]
            
            // Get the response from the model
            const chatRequest = await model.sendRequest(messages, {}, token);

            for await (const fragment of chatRequest.text) {
                response.markdown(fragment);
            }

    }

    else {
        response.markdown('Sorry, I can only provide information about the schedule. Please ask about the schedule or sessions.');
    }
    });

    context.subscriptions.push(cppconParticipant);
}

export function deactivate() { }