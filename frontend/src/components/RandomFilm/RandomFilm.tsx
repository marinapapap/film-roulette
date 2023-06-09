import React, { useState, useEffect } from "react";
import "./RandomFilm.css";
import { Logout } from "../Auth/Logout";

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

interface RandomFilmProps {
  navigate: Function;
  setGlobalSession: Function;
}

export const RandomFilm: React.FC<RandomFilmProps> = ({
  navigate,
  setGlobalSession,
}) => {
  const [randomFilm, setRandomFilm] = useState<Film>({
    result: {
      id: "",
      rank: "",
      title: "",
      fullTitle: "",
      year: "",
      image: "",
      crew: "",
      imDbRating: "",
      imDbRatingCount: "",
    },
  });
  const [renderFilm, setRenderFilm] = useState<boolean>(false);
  const [inSession, setInSession] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/tokens/validate");
        const responseData = await response.json();

        if (responseData.session === true) {
          setInSession(true);
          setGlobalSession(true);
        }
      } catch (error) {
        setInSession(false);
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/randomFilm");
      const data = (await response.json()) as any;
      setRandomFilm(data);
      setRenderFilm(true);
      setSaved(data.saved);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/users/films", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          film: {
            ...randomFilm.result,
          },
        }),
      });

      const data = (await response.json()) as any;
      data.message === "OK" ? setSaved(true) : setSaved(false);
    } catch (error) {
      setSaved(false);
      console.error(error);
    }
  };

  const showRandomFilm = (): JSX.Element => {
    return (
      <>
        <h1 className="example" data-cy="fulltitle">
          {randomFilm.result.title}
        </h1>
        <p data-cy="crew">{randomFilm.result.crew}</p>
        <div>
          <img
            src={randomFilm.result.image}
            alt=""
            data-cy="image"
            width="300"
            height="400"
          ></img>
        </div>

        {/* <p data-cy="rating">ImDb rating: {randomFilm.result.imDbRating}/10</p> */}
        <div></div>
      </>
    );
  };

  const renderSaveButton = () => {
    return (
      <>
        {saved === false ? (
          <button
            className="button-rf"
            type="submit"
            onClick={handleSave}
            data-cy="button"
          >
            Save For Later
          </button>
        ) : (
          <button
            className="button-rf saved"
            type="button"
            data-cy="button-disabled"
            disabled
          >
            Saved
          </button>
        )}
      </>
    );
  };

  return (
    <div className="App">
      <div>
        <Logout
          navigate={navigate}
          inSession={inSession}
          setInSession={setInSession}
        />
      </div>

      <div className="film-roulette">
        <div>{renderFilm === true ? showRandomFilm() : false}</div>
        <div>
          <button
            className="button-rf"
            type="submit"
            onClick={handleSubmit}
            data-cy="button"
          >
            Film Roulette
          </button>

          <span style={{ margin: "20px" }}></span>
          {renderFilm && inSession ? renderSaveButton() : false}
        </div>
      </div>
    </div>
  );
};
