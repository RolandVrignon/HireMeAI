import { LinkPreview } from "../ui/link-preview";

type EducationProps = {
    image: string;
    title: string;
    subtitle: string;
    startDate: string;
    endDate: string;
    description: string;
    url: string;
};

export const Education = ({ image, title, subtitle, startDate, endDate, description, url }: EducationProps) => {
    return (
        <div className="flex flex-col gap-10 education-item">
            <LinkPreview url={url}>
              <h2>{title}</h2>
              <h3>{subtitle}</h3>
              <p>{startDate} - {endDate}</p>
              <p>{description}</p>
            </LinkPreview>
        </div>
    );
};