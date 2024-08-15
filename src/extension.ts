import { renderPrompt } from '@vscode/prompt-tsx';
import * as vscode from 'vscode';
import { PlayPrompt } from './play';

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

            const scheduleInfo = `
            **CppCon 2024 Schedule:** 
            - **Day 1**
                - 11:00 - Creating a Sender/Receiver HTTP Server by Dietmar Kühl
                - 11:00 - Security Beyond Memory Safety - Using Modern C++ to Avoid Vulnerabilities by Design by Max Hoffmann
                - 11:00 - Back to Basics: Unit Testing by Dave Steffen
                - 11:00 - What Volatile Means (and Doesn’t Mean) by Ben Saks
                - 14:00 - So You Think You Can Hash by Victor Ciura
                - 14:00 - When Lock-Free Still Isn't Enough: An Introduction to Wait-Free Programming and Concurrency Techniques by Daniel Anderson
                - 14:00 - Back to Basics: Almost Always Vector? by Kevin Carpenter
                - 14:00 - Message Handling with Boolean Algebra by Ben Deane
                - 14:00 - Common Package Specification (CPS) in practice: A full round trip implementation in Conan C++ package manager by Diego Rodriguez-Losada Gonzalez
                - 15:15 - Many ways to kill an Orc (or a Hero) by Patrice Roy
                - 15:15 - Can You RVO? Using Return Value Optimization for Performance in Bloomberg C++ Codebases by Michelle Fae D'Souza
                - 15:15 - Bridging the Gap: Writing Portable Programs for CPU and GPU by Thomas Mejstrik
                - 15:15 - The Most Important Design Guideline is Testability by Jody Hagins
                - 15:15 - LLVM's Realtime Safety Revolution: Tools for Modern Mission Critical Systems by Christopher Apple
                - 16:45 - Composing Ancient Mathematical Knowledge Into Powerful Bit-fiddling Techniques by Jamie Pond
                - 16:45 - Work Contracts – Rethinking Task Based Concurrency and Parallelism for Low Latency C++ by Michael Maniscalco
                - 16:45 - Data Is All You Need for Fusion by Manya Bansal
                - 16:45 - How Meta Made Debugging Async Code Easier with Coroutines and Senders by Ian Petersen • Jessica Wong
            - **Day 2**
                - 09:00 - Reflection based libraries to look forward to by Saksham Sharma
                - 09:00 - Back to Basics: Function Call Resolution by Ben Saks
                - 9:00 - Multi Producer, Multi Consumer, Lock Free, Atomic Queue - User API and Implementation by Erez Strauss
                - 09:00 - Relocation: Blazing Fast Save And Restore, Then More! by Eduardo Madrid
                - 09:00 - What’s eating my RAM? by Jianfei Pan
                - 10:30 - Plenary
                - 14:00 - C++26 Preview by Jeff Garland
                - 14:00 - Back to Basics: Debugging and Testing by Greg Law • Mike Shah
                - 14:00 - Leveraging C++20/23 Features for Low Level Interactions by Jeffrey Erickson
                - 14:00 - Fast and small C++ - When efficiency matters by Andreas Fertig
                - 14:00 - Shared Libraries and Where To Find Them by Luis Caro Campos
                - 15:15 - High-performance, Parallel Computer Algebra in C++ by David Tran
                - 15:15 - Unraveling string_view: Basics, Benefits, and Best Practices by Prithvi Okade
                - 15:15 - Techniques to Optimise Multithreaded Data Building During Game Development by Dominik Grabiec
                - 15:15 - Design Patterns - The Most Common Misconceptions (2 of N) by Klaus Iglberger
                - 15:15 - Compile-time Validation by Alon Wolf
                - 15:50 - Application of C++ in Computational Cancer Modeling by Ruibo Zhang
                - 16:45 - Taming the C++ Filter View by Nicolai Josuttis
                - 16:45 - Using Modern C++ to Build XOffsetDatastructure: A Zero-Encoding and Zero-Decoding High-Performance Serialization Library in the Game Industry by Fanchen Su
                - 16:45 - Designing C++ code generator guardrails: A collaboration among outreach and development teams and users by Sherry Sontag • CB Bailey
                - 16:45 - Vectorizing a CFD Code With std::simd Supplemented by (Almost) Transparent Loading and Storing by Olaf Krzikalla
                - 16:45 - 10 Problems Large Companies Have with Managing C++ Dependencies and How to Solve Them by Augustin Popa
            - **Day 3**
                - 09:00 - Hidden Overhead of a Function API by Oleksandr Bacherikov
                - 09:00 - Back to Basics: Generic Programming by David Olsen
                - 09:00 - Coroutines and Structured Concurrency in Practice by Dmitry Prokoptsev
                - 09:00 - Improving our safety with a quantities and units library by Mateusz Pusz
                - 09:00 - Building Cppcheck - What We Learned from 17 Years of Development by Daniel Marjamäki
                - 10:30 - Plenary
                - 14:00 - Designing a Slimmer Vector of Variants by Christopher Fretz
                - 14:00 - Back to Basics: Concepts by Nicolai Josuttis
                - 14:00 - Contracts for C++ by Timur Doumler
                - 14:00 - Dependency Injection in C++ : A Practical Guide by Peter Muldoon
                - 14:00 - Secrets of C++ Scripting Bindings: Bridging Compile Time and Run Time by Jason Turner
                - 15:15 - The Beman Project: Bringing Standard Libraries to the Next Level by David Sankel
                - 15:15 - Building Safe and Reliable Surgical Robotics with C++ by Milad Khaledyan
                - 15:15 - C++ Under the Hood by Chris Ryan
                - 15:15 - Reusable code, reusable data structures by Sebastian Theophil
                - 15:15 - Beyond Compilation Databases to Support C++ Modules: Build Databases by Ben Boeckel
                - 16:45 - Implementing Ranges and Views by Roi Barkan
                - 16:45 - Making Hard Tests Easy: A Case Study From the Motion Planning Domain by Chip Hogg
                - 16:45 - Hiding your Implementation Details is Not So Simple by Amir Kirsh
                - 16:45 - Modern C++ Error Handling by Phil Nash
                - 16:45 - Why Google Doesn't Allow Ranges in Our Codebase by Daisy Hollman
            - **Day 4**
                - 09:00 - Deciphering C++ Coroutines - Mastering Asynchronous Control Flow by Andreas Weis
                - 09:00 - Back to Basics: Functional Programming in C++ by Jonathan Müller
                - 09:00 - Performance engineering - being friendly to your hardware by Ignas Bagdonas
                - 09:00 - SuperCharge Your IPC Programs With C++20 and CCI Pattern by Arian Ajdari
                - 09:00 - Mix Assertion, Logging, Unit Testing and Fuzzing: Build Safer Modern C++ Application by Xiaofan Sun
                - 10:30 - Plenary
                - 14:00 - Back to Basics: C++ Lifetime Management by Phil Nash
                - 14:00 - Sender Patterns to Wrangle Concurrency in Embedded Devices by Michael Caisse
                - 14:00 - Perspectives on Contracts by Lisa Lippincott
                - 14:00 - Limitations and Problems in std::function and Similar Constructs: Mitigations and Alternatives by Amandeep Chawla
                - 14:00 - Why is my build so slow? Compilation Profiling and Visualization by Samuel Privett
                - 15:15 - Implementing Particle Filters with Ranges by Nahuel Espinosa
                - 15:15 - Blazing Trails: Building the World's Fastest GameBoy Emulator in Modern C++ by Tom Tesch
                - 15:15 - To Int or to Uint, This is the Question by Alex Dathskovsky
                - 15:15 - High-performance Cross-platform Architecture: C++ 20 Innovations by Noah Stein
                - 15:15 - What’s new for Visual Studio Code: Performance, GitHub Copilot, and CMake Enhancements by Sinem Akinci and Alexandra Kemper
                - 15:50 - Investigation of performance for a robotic arm motion planner using modern Cpp by Aditi Pawaskar
                - 16:45 - Irksome C++ by Walter E Brown
                - 16:45 - A Simple Rollback System in C++: The Secret Behind Online Multiplayer Games by Elias Farhan
                - 16:45 - spanny 2: rise of std::mdspan by Griswald Brooks
                - 16:45 - Linear Algebra with The Eigen C++ Library by Daniel Hanson
                - 16:45 - Monadic Operations in Modern C++: A Practical Approach by Vitaly Fanaskov
            - **Day 5**
                - 09:00 - An ode to Concepts by Nina Ranns
                - 09:00 - Back to Basics: Object-Oriented Programming by Andreas Fertig
                - 09:00 - Balancing Efficiency and Flexibility: Cost of Abstractions in Embedded Systems by Marcell Juhasz
                - 09:00 - Template-less Meta-programming by Kris Jusiak
                - 09:00 - import CMake; // Mastering C++ Modules by Bill Hoffman
                - 10:30 - Interesting Upcoming Features from Low latency, Parallelism and Concurrency from Kona 2023, Tokyo 2024, and St. Louis 2024 by Paul E. McKenney • Maged Michael • Michael Wong
                - 10:30 - Back to Basics: Rvalues and Move Semantics by Amir Kirsh
                - 10:30 - Boosting Software Efficiency: A Case Study of 100% Performance Improvement in an Embedded C++ System by Gili Kamma
                - 10:30 - C++/Rust Interop: Using Bridges in Practice by Tyler Weaver
                - 10:30 - Implementing Reflection using the new C++20 Tooling Opportunity: Modules by Maiko Steeman
                - 13:30 - Addressing Cross-platform Floating-point Determinism by Sherry (née Sergey) Ignatchenko
                - 13:30 - Implementing Large Language Model (LLMs) Inference in Pure C++ by Filipe Mulonde
                - 13:30 - High-Performance Numerical Integration in the Age of C++26 by Vincent Reverdy
                - 13:30 - Adventures with Legacy Codebases: Tales of Incremental Improvement by Roth Michaels
                - 13:30 - What's New in Visual Studio for C++ Developers by Michael Price • Mryam Girmay
                - 14:45 - Data Structures That Make Video Games Go Round by Al-Afiq Yeong
                - 14:45 - Code Generation from Universal Robotics Description Format (URDF) for Accelerated Robotics by Paul Gesel
                - 14:45 - A new dragon in the den: fast conversion from floating-point numbers by Cassio Neri
                - 14:45 - Newer Isn’t Always Better, Investigating Legacy Design Trends and Their Modern Replacements by Katherine Rocha
                - 14:45 - Reflection Is Not Contemplation by Andrei Alexandrescu
            `;
        
        //Structure the schedule to send to the model
        const messages = [
            new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, 'You must look through the schedule provided and give a response according to what the user is asking for. Please search through the schedule data and provide the relevant talks for the question I ask. Please notice that each day has a separate list of talks below each day market. The schedule info is provided below'),
            new vscode.LanguageModelChatMessage(vscode.LanguageModelChatMessageRole.User, scheduleInfo),
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