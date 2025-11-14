import { cn } from "../lib/utils";
import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordian";

const ScoreBadge = ({ score = 0 }) => {
  const numScore = typeof score === 'number' ? score : 0;
  
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        numScore > 69
          ? "bg-badge-green"
          : numScore > 39
          ? "bg-badge-yellow"
          : "bg-badge-red"
      )}
    >
      <img
        src={numScore > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          numScore > 69
            ? "text-badge-green-text"
            : numScore > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text"
        )}
      >
        {numScore}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({ title, categoryScore = 0 }) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({ tips = [] }) => {
  if (!Array.isArray(tips) || tips.length === 0) {
    return (
      <div className="text-gray-500 p-4">
        No tips available for this category.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt="score"
              className="size-5"
            />
            <p className="text-xl text-gray-500">{tip.tip || 'No tip text'}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + (tip.tip || index)}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="score"
                className="size-5"
              />
              <p className="text-xl font-semibold">{tip.tip || 'No tip text'}</p>
            </div>
            <p>{tip.explanation || 'No explanation available'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }) => {
  console.log("Details feedback:", feedback);

  // Safely extract category data with defaults
  const toneAndStyle = feedback?.toneAndStyle || feedback?.tone_and_style || { score: 0, tips: [] };
  const content = feedback?.content || { score: 0, tips: [] };
  const structure = feedback?.structure || { score: 0, tips: [] };
  const skills = feedback?.skills || { score: 0, tips: [] };

  if (!feedback || typeof feedback !== 'object') {
    return (
      <div className="bg-white rounded-2xl shadow-md w-full p-8">
        <div className="text-center text-gray-500">
          <p>No detailed feedback available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={toneAndStyle.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={toneAndStyle.tips || []} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={content.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={content.tips || []} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={structure.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={structure.tips || []} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={skills.score || 0}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={skills.tips || []} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;