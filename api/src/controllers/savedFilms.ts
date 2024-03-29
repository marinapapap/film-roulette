import { Request, Response } from "express";
import { IFilm } from "../models/user";
import { getUserIdFromToken, findUserById } from "../helperFunctions";

export const RandomFilmController = {
  SaveFilm: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = getUserIdFromToken(token);

      const { film }: { film: IFilm } = req.body;
      if (!film || !film.id || !film.title) {
        return res.status(400).json({ message: "Invalid film data" });
      }

      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const filmData: IFilm = { ...film };
      if (user.films.length === 10) {
        return res.status(403).json({
          error: "Limit Reached",
          message: "You have reached the limit for saved films",
        });
      }
      user.films.push(filmData);
      await user.save();

      return res.status(201).json({ user, message: "OK" });
    } catch (error) {
      console.error("Error saving film:", error);
      return res.status(500).json({ message: "Failed to save film" });
    }
  },

  GetFilms: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = getUserIdFromToken(token);

      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(201).json({ films: user.films, message: "OK" });
    } catch (error) {
      console.error("Error getting films:", error);
      return res
        .status(500)
        .json({ message: "Failed to get users saved films" });
    }
  },

  RemoveFilm: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = getUserIdFromToken(token);

      const filmIndex: number = req.body.filmIndex;
      if (typeof filmIndex !== "number") {
        return res.status(400).json({ message: "Invalid film index" });
      }

      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (filmIndex >= 0 && filmIndex < user.films.length) {
        user.films.splice(filmIndex, 1);
        await user.save();

        return res
          .status(200)
          .json({ user, message: "Film deleted successfully" });
      } else {
        return res.status(404).json({ message: "Invalid film index" });
      }
    } catch (error) {
      console.error("Error saving film:", error);
      return res.status(500).json({ message: "Failed to save film" });
    }
  },
};
