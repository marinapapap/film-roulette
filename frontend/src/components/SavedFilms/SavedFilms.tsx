import React, { useState, useEffect } from "react";
import "./SavedFilms.css";
import { Menu } from "../Menu/Menu";

interface Film {
  result: {
    id: string;
    rank: string;
    title: string;
    fullTitle: string;
    year: string;
    image: string;
    crew: string;
    imDbRating: string;
    imDbRatingCount: string;
  };
}

interface Saved {
  films: Film[];
}

interface SavedFilmsProps {
  navigate: Function;
}

export const SavedFilms: React.FC<SavedFilmsProps> = ({ navigate }) => {
  const [inSession, setInSession] = useState<boolean>(false);
  const [saved, setSaved] = useState<Saved>({ films: [] });
  const [isHomepage] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch("/tokens/validate");
        const responseData = await response.json();
        if (!responseData.session) {
          navigate("/");
        }

        setInSession(true);
      } catch (error) {
        navigate("/");
        console.error(error);
      }
    };
    validateToken();
  }, []);

  useEffect(() => {
    fetchFilms();
    noFilmsSavedNotice();
  }, [saved.films]);

  const fetchFilms = async () => {
    try {
      const response = await fetch("/savedFilms/films");
      const responseData = await response.json();
      setSaved(responseData);
      setIsFetched(true);
    } catch (error) {
      navigate("/");
      console.error(error);
    }
  };

  const deleteFilm = async (index: number) => {
    try {
      await fetch("/savedFilms/film", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filmIndex: index,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderFilms = (): JSX.Element[] => {
    return saved.films.map((film: any, index: number) => {
      return (
        <div>
          <div className="film">
            <div className="film-title" key={`fullTitle${index + 1}`}>
              {film.fullTitle}
            </div>
            <p>ImDb rating: {film.imDbRating}/10</p>
            <img
              src={film.image}
              alt=""
              key={`image${index + 1}`}
              width="300"
              height="400"
            ></img>
            <button
              className="delete-button"
              type="submit"
              onClick={() => deleteFilm(index)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    });
  };

  const noFilmsSavedNotice = () => {
    if (isFetched && !saved.films.length) {
      return (
        <div className="saved-msg">
          <p>Save films to curate your personal watch list here.</p>
          <p>
            You only have 10 slots to fill before it's time to actually start
            watching them!
          </p>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div className="content">
        <Menu
          navigate={navigate}
          inSession={inSession}
          setInSession={setInSession}
          isHomepage={isHomepage}
        />
        <div className="film-content">
          <div className="film-grid">{renderFilms()}</div>
        </div>
      </div>
      {noFilmsSavedNotice()}
    </>
  );
};

export default SavedFilms;
