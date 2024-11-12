'use server';

import { getMutableAIState, streamUI, createStreamableValue } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import React, { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import ReactMarkdown from 'react-markdown';
import { ShowEducation } from './serverComponents/education';
import { educationData } from '@/data/educationData';

const system = ` You are Roland AI's Assistant, your role is to present Roland's resume.
  
Roland Vrignon
Full-Stack Web Developer
+33 7 69 70 12 68
roland.vrignon@gmail.com
Paris, 18
Driving License
26 yo


 Professional experiences                                                          Self-taught and curious, I'm highly
                                                                                   motivated to constantly develop my IT skills.
                                                                                   I enjoy automating processes and
                                                                                   embarking on new personal projects. I like
Aitwork - Founder                                                                    to challenge myself in areas I'm not familiar
ChatGPT Like multi-model B2B                                                         with, in order to surpass myself.
March 2023 - Today                                      demo@aitwork.io

https://app.aitwork.io                                  demo

  Aitwork is a B2B platform focused on the use of Artificial Intelligence in
  business. The platform enables the administrator to create multiple
  accounts for company employees. Finally, users will be able to connect
                                                                                       LinkedIn
  and use AI with an experience similar to ChatGPT.
                                                                                   www.linkedin.com/in/roland-vrignon
  Aitwork allows the company to choose the templates available for Text to             Github
  Text - Text to speech - Speech to text - Text to Image - Image to Text.          https://github.com/rolandvrignon

  As founder, I developed the entire platform.

  I learned to manipulate many APIs in the AI field. I also worked on
  chunking docx and pdf documents to store them as vectors for knn                 Skills
  search.
                                                                                   HTML CSS SASS JAVASCRIPT TYPESCRIPT
                                                                                   NODEJS       REACTJS   EXPRESS   MONGODB
Blindating - Founder                                                                 GIT C AWS GITHUB PYTHON LINUX C++
University dating application                                                        OMV       DOCKER       BASH   ZSH    OPENAI

 February 2021- October 2022                                                       CLAUDE2 BARD TYPESCRIPT MIDJOURNEY
                                                                                   MISTRAL       SINGLESTORE VECTORSEARCH
 https://blindating.rolexx.fr
                                                                                   KNN ADOBE PHOTOSHOP FIGMA
   Blindating is a university dating application based on a questionnaire. One
   completed form = One match!
                                                                                   Languages
   300 registrations on the 1st day of launch at Nanterre University
   + 900 matches in 3 weeks                                                        French - native
                                                                                   English - advanced
                                                                                   German - intermediate


Pierre&Vacances | Groupe PVCP                                                        Leisure

E-Merchandiser work-study
                                                                                   Soccer
September 2019 - August 2021
                                                                                   Street Art
   Website personalization                                                         Computer Science
   AB Tests (AB Tasty, Optimize)
   Performance analysis (Hotjar, Google Analytics, ContentSquare)



  Educational : 
  
  42, Paris
  Systems and network administrator           
  https://42.fr/                    
  May 2022 - December 2023


  IIM, Paris
  Strategy & e-business Master's degree
  https://www.iim.fr/
  September 2019 - August 2021

  IIM, Paris
  Web Developpement Bachelor's degree
  https://www.iim.fr/
  September 2016 - August 2018
`

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
  loadingState: any;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();
  const loadingState = createStreamableValue({ loading: true });

  const result = await streamUI({
    model: openai('gpt-4o-mini'),
    messages: [
      ...history.get(),
      { role: 'system', content: system },
      { role: 'user', content: input }
    ],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
        loadingState.done({ loading: false });
      }

      return (
        <ReactMarkdown>{content}</ReactMarkdown>
      );
    },
    tools: {
      showWeatherLocation: {
        description: 'Display the weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        generate: async ({ location }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: 'assistant',
              content: `Showing Meteo for ${location}`,
            },
          ]);

          return (
            <div className="flex flex-col gap-2">
                <p>{location}</p>
                <p>67 degrees.</p>
            </div>
          );
        },
      },
      showEducation: {
        description: 'Display the education history of the resume.',
        parameters: z.object({
            display: z.boolean(),
        }),
        generate: async (educations) => {

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: 'assistant',
              content: `Displaying education history`,
            },
          ]);
      
          loadingState.done({ loading: false });

          return (
            <ShowEducation educationData={educationData} />
          );
        }
      }
    }
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
    loadingState: loadingState.value,
  };
}
