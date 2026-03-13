import { createBrowserRouter, Navigate } from "react-router-dom";
import { GameBoard } from "@/components/game/GameBoard";
import Index from "@/pages/Index";
import Collection from "@/pages/Collection";
import DeckBuilder from "@/pages/DeckBuilder";
import BattleScreen from "@/pages/BattleScreen";
import NotFound from "@/pages/NotFound";
import AppShell from "./AppShell";
import V2Shell from "./v2/V2Shell";
import HomeV2 from "@/pages/v2/HomeV2";
import CollectionV2 from "@/pages/v2/CollectionV2";
import DeckBuilderV2 from "@/pages/v2/DeckBuilderV2";
import BattleV2Container from "@/pages/v2/BattleV2Container";
import { featureFlags } from "@/config/featureFlags";

const rootIndexRoute = featureFlags.v2Enabled && featureFlags.v2Default
  ? { index: true, element: <Navigate to="/v2" replace /> }
  : { index: true, element: <Index /> };

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      rootIndexRoute,
      { path: "collection", element: <Collection /> },
      { path: "deck-builder", element: <DeckBuilder /> },
      { path: "battle", element: <BattleScreen /> },
      { path: "game", element: <GameBoard /> },
      { path: "404", element: <NotFound /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
  },
  ...(featureFlags.v2Enabled
    ? [
        {
          path: "/v2",
          element: <V2Shell />,
          children: [
            { index: true, element: <HomeV2 /> },
            { path: "collection", element: <CollectionV2 /> },
            { path: "deck-builder", element: <DeckBuilderV2 /> },
            { path: "battle", element: <BattleV2Container /> },
            { path: "game", element: <GameBoard /> },
          ],
        },
      ]
    : []),
]);
