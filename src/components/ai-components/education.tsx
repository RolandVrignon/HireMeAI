"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import { useState, useEffect } from 'react';

type EducationProps = {
  image: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: string;
  url: string;
};

const Education = ({ image, title, subtitle, startDate, endDate, description, url }: EducationProps) => {
  return (
    <div className="flex flex-col gap-2 education-item bg-red-500 rounded-xl p-2">
      <LinkPreview url={url}>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
        <p>{startDate} - {endDate}</p>
        <p>{description}</p>
      </LinkPreview>
    </div>
  );
};

export const ShowEducation = ({ educationData }: { educationData: EducationProps[] }) => {
  const [displayedEducations, setDisplayedEducations] = useState<EducationProps[]>([]);

  useEffect(() => {
    const streamEducation = async () => {
      for (let i = 0; i < educationData.length; i++) {
        setDisplayedEducations((prev) => {
          if (!prev.some((edu) => edu.title === educationData[i].title)) {
            return [...prev, educationData[i]];
          }
          return prev;
        });

        if (i < educationData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };

    streamEducation();
  }, [educationData]); // Déclencher lorsque les données d'éducation changent

  return (
    <div className="flex flex-col gap-5">
      {displayedEducations.map((education, index) => (
        <Education 
          key={index} 
          title={education.title} 
          subtitle={education.subtitle} 
          startDate={education.startDate} 
          endDate={education.endDate} 
          description={education.description} 
          image={education.image} 
          url={education.url} 
        />
      ))}
    </div>
  );
};
