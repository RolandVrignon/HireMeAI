'use server';

import { getMutableAIState, streamUI, createStreamableValue } from 'ai/rsc';
import { mistral } from '@ai-sdk/mistral';
import React, { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import ReactMarkdown from 'react-markdown';
import { ShowEducation } from '@/components/ai-components/education';
import { educationData } from '@/data/educationData';
import { ThemeSwitcher } from '@/components/ai-components/themeSwitcher';
import { LanguageSwitcher } from '@/components/ai-components/languageSwitcher';
import { ClientMessage, ServerMessage, UIInterface } from '@/types/types';
import { MarkdownInterpretor } from '@/components/ai-components/markdownInterpretor'

const username = process.env.NEXT_PUBLIC_USER_NAME;

const fetchResumeText = async (url : string): Promise<string> => {
  const res = await fetch(`${url}/api/resume`);
  if (!res.ok) {
    throw new Error('Failed to fetch resume text');
  }
  const data = await res.json();
  return data.result || 'Texte du résumé introuvable.';
};

export async function continueConversation(
  input: string,
  ui: UIInterface
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();
  const loadingState = createStreamableValue({ loading: true });
  const resume = await fetchResumeText(ui.url);

  const UIPrompt = `You are a professional wingman for ${username}, acting as their personal career advocate. Your role is to showcase ${username}'s skills, experience, and potential in the most compelling and professional way possible.

Current Theme is ${ui.theme} mode.
Please answer in ${ui.language}, this is really important!

Here is ${username}'s resume:
${resume}

Communication Style:
- Use emojis strategically to make your messages more engaging and memorable 🎯
- Format your responses with bullet points and clear sections when appropriate
- Use markdown formatting to highlight key points
- Keep a professional yet friendly tone
- Make your messages visually appealing and easy to read

Guidelines:
- Be enthusiastic but maintain professionalism 🤝
- Highlight ${username}'s achievements and unique selling points ⭐
- Connect ${username}'s experience to potential value for employers 💼
- Be ready to explain how ${username}'s skills can solve specific business challenges 🎯
- Use concrete examples from the resume to support your points 📊
- Keep responses concise but impactful ✨
- Maintain a confident but not arrogant tone 💪
- If asked about weaknesses, frame them constructively as areas of growth 📈
- Feel free to use the theme switcher or language switcher when appropriate to enhance the conversation 🔄

Examples of emoji usage:
- Use 💻 for technical skills
- Use 🎓 for education
- Use 🏆 for achievements
- Use 🚀 for growth/improvements
- Use 👥 for team/collaboration experiences
- Use 🌟 for unique selling points
- Use 🔧 for problem-solving examples
- Use 📈 for improvements/growth

Your goal is to help potential employers see ${username} as the ideal candidate for their needs while keeping the conversation engaging and professional. Make your responses visually appealing with appropriate use of emojis, formatting, and clear structure.`

  let messages = history.get();
  messages.push({ role: 'user', content: input });
  history.update(messages);

  const result = await streamUI({
    model: mistral('mistral-small-latest'),
    messages: [      
      { role: 'system', content: UIPrompt },
      ...history.get(),
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
  
      return <MarkdownInterpretor content={content}/>;
    },
    tools: {
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
      },
      changeTheme: {
        description: 'Display the education history of the resume.',
        parameters: z.object({
          theme: z.enum(['dark', 'light']),
        }),
        generate: async ({ theme }) => {

          if (theme === ui.theme) {
            history.done((messages: ServerMessage[]) => [
              ...messages,
              {
                role: 'assistant',
                content: `Theme already set to ${theme} theme.`,
              },
            ]);
          } else {
            history.done((messages: ServerMessage[]) => [
              ...messages,
              {
                role: 'assistant',
                content: `Changing Theme to ${theme} theme.`,
              },
            ]);
          }

          loadingState.done({ loading: false });

          return (
            <ThemeSwitcher themeProvided={theme} language={ui.language}/>
          );
        }
      },
      changeLangugae: {
        description: `Change application's language`,
        parameters: z.object({
          language: z.enum(['en', 'fr', 'de', 'nl', 'es']),
        }),
        generate: async ({ language }) => {

          if (language === ui.language) {
            history.done((messages: ServerMessage[]) => [
              ...messages,
              {
                role: 'assistant',
                content: `Changing Application language to ${language}.`,
              },
            ]);
          } else {
            history.done((messages: ServerMessage[]) => [
              ...messages,
              {
                role: 'assistant',
                content: `Application language already set to ${language}.`,
              },
            ]);
          }

          loadingState.done({ loading: false });

          return (
            <LanguageSwitcher newLanguage={language}/>
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
    date: new Date(),
  };
}
