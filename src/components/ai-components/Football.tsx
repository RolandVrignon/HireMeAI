import React from 'react';
import { Tilt } from '../ui/tilt';
import { LanguageContext } from '@/providers/language-provider';

interface MatchData {
  competition: {
    name: string;
    emblem: string;
  };
  utcDate: string;
  homeTeam: {
    name: string;
    crest: string;
    shortName: string;
  };
  awayTeam: {
    name: string;
    crest: string;
    shortName: string;
  };
  score: {
    fullTime: {
      home: number;
      away: number;
    };
    halfTime: {
      home: number;
      away: number;
    };
  };
  referees: {
    name: string;
    nationality: string;
  }[];
}

interface FootballProps {
    matches: MatchData[];
    translations: any;
}   

const Football: React.FC<FootballProps> = ({ matches, translations }) => {
  const { language } = React.useContext(LanguageContext);
  
  return (
    <div className="flex flex-col gap-2">
      {matches.map((match, index) => (
        <Tilt key={index} className="flex flex-col gap-3 bg-black/5 text-gray-700 dark:bg-white/5 dark:text-white rounded-xl p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img 
                src={match.competition.emblem} 
                alt={match.competition.name} 
                className="w-4 h-4"
                />
                <span className="font-bold">{match.competition.name}</span>
            </div>

            {/* Date */}
            <div>
                {new Date(match.utcDate).toLocaleDateString(language, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
                })}
            </div>
          </div>
          {/* Teams */}
          <div className="flex items-center mb-4">
            {/* Home Team - Left Side */}
            <div className="flex flex-col items-center gap-2 flex-1 justify-end">
              <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-12 h-12" />
              <span>{match.homeTeam.shortName}</span>
            </div>

            {/* Score - Center */}
            <div className="font-bold font-doto text-3xl px-4 min-w-[80px] text-center">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </div>

            {/* Away Team - Right Side */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-12 h-12" />
              <span>{match.awayTeam.shortName}</span>
            </div>
          </div>

          {/* Referee */}
          <div className="text-sm bottom-2">
            {translations.football.referee} : {match.referees[0]?.name} ({match.referees[0]?.nationality})
          </div>
        </Tilt>
      ))}
    </div>
  );
};

export default Football;
