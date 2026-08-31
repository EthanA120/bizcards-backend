import bcrypt from "bcryptjs";
import chalk from "chalk";

import { User } from "../models/userModel.js";
import { Card } from "../models/cardModel.js";
import initialUsers from "../data/initialUsers.json" with { type: "json" };
import initialCards from "../data/initialCards.json" with { type: "json" };

export default async function generateInitialData() {
  try {
    const users = await generateInitialUsers();
    
    if (users && users.length > 0) {
      // Find a business user or fallback to the first user
      const businessUser = users.find((user) => user.isBusiness) || users[0];
      
      await generateInitialCards(businessUser._id);
    } else {
      console.log(chalk.yellow("No users available to bind cards to."));
    }
  } catch (err) {
    console.log(chalk.red("Error initializing data: " + err.message));
  }
}

const generateInitialUsers = async () => {
  try {
    let users = await User.find();

    if (users.length === 0) {
      const hashedUsers = await Promise.all(
        initialUsers.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          return { ...user, password: hashedPassword };
        })
      );

      users = await User.insertMany(hashedUsers);
      console.log(chalk.green("Initial users data generated successfully."));
    }

    return users;
  } catch (err) {
    console.log(chalk.red("Error generating users: " + err.message));
    throw err;
  }
};

const generateInitialCards = async (businessUserId) => {
  try {
    const cards = await Card.find();

    if (cards.length === 0) {
      // Keep track of generated bizNumbers to avoid duplicates in the seed process
      const usedBizNumbers = new Set();

      const cardsToInsert = initialCards.map((card) => {
        let bizNumber = card.bizNumber;

        // Generate unique 7-digit number if missing or already used
        if (!bizNumber || usedBizNumbers.has(bizNumber)) {
          do {
            bizNumber = Math.floor(1000000 + Math.random() * 9000000);
          } while (usedBizNumbers.has(bizNumber));
        }

        usedBizNumbers.add(bizNumber);

        return {
          ...card,
          user_id: businessUserId,
          bizNumber,
          likes: card.likes || []
        };
      });

      await Card.insertMany(cardsToInsert);
      console.log(chalk.green("Initial cards data generated successfully."));
    }
  } catch (err) {
    console.log(chalk.red("Error generating cards: " + err.message));
    throw err;
  }
};