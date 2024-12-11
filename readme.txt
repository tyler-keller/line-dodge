# Project Justification:

linedogde.pro is a game in which the player controls a dot and has to avoid lines.

It doesn't sound like a difficult project on the surface, but with each feature we implemented came a variety of challenges.

Below, we will address each point of the rubric and why our game meets each requirement:

## Visually appealing (10 points)  

We believe the game looks really good. Wes, our UI/UX specialist, did an amazing job at applying a certain type of arcade CRT TV aesthetic to the game.

The game has a single dark mode-esque theme. Buttons are responsive to the end user. Each element is minimalistic and serves to provide visually responsiveness to the gameplay.

Additionally, audio elements help to immerse the player and make the overall experience more enjoyable.

## Game is not too hard or too easy, instructions make it possible to play immediately (10 points)

In our menu screen, we have a 'How to Play' button that supplies the user with all necessary controls.

With each new feature, we had to tune a variety of elements to make sure that the game starts off slow enough to give the player a chance to learn the mechanics.

As each round increases, so does the number of lines to clear and the speed at which the lines move.

## Motivating factor (scoring mechanism OR able to win OR really want to avoid losing) (20 points) 

The motivating factor for each player should be to make it to the end of round 5. 

We also added a score mechanic to incentize players to pursue higher and higher scores.

## Sufficient JavaScript complexity (20 points) 

The game itself is not very complex. 

Our team employed a normalized sigmoid function to progressively ramp up the line speed as each round progresses.

This was a sufficiently complex element to add as it required a lot of parameter tuning to ensure that line speed is effectively slowed down and ramped up over the course of a single round.

## Good error handling, no bugs (20 points) 

The game started development with a number of bugs. One of the most difficult to track down was frame requests.

Our initial loop requested frames when they were available, which led to extremely fast (impossible to beat) gameplay.

However, this bug was device dependent. In researching more, we found that the bug corresponded to monitor refresh rates.

To fix it, we had to keep track of the actual time elapsed between frames to determine the movement of gameplay elements.

All in all, we believe the end game is sufficiently polished. 