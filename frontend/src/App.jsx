import { useState } from 'react'
import ClerkProviderWithRoutes from './auth/ClerkProviderWithRoute'
import { Layout } from "./layout/Layout"
import { AuthenticationPage } from "./auth/AuthenticationPage"
import { Routes, Route, Navigate } from 'react-router-dom'
import MealPlan from "./pages/FoodPlanning/MealPlane"
import MealPlanMain from "./pages/FoodPlanning/MealPlanMain"
import GroceryList from "./pages/FoodPlanning/GroceryList"
import ProductSearch from './pages/FoodPlanning/ProductSearch'
import RoutineDashboard from './pages/RoutineDashboard'
import RoutineEdit from './pages/RoutineEdit'
import MealSurvey from './pages/FoodPlanning/MealSurvay'
import ChatPage from './pages/chat/ChatPage'

import './App.css'

function ProtectedMealPlan() {
  const isNewUser = false; // fake flag for now

  if (isNewUser) {
    return <Navigate to="/meal-survey" replace />;
  }

  return <MealPlan />;
}


function App() {
  return (
    <ClerkProviderWithRoutes>
        <Routes>
          <Route path="/sign-in/*" element={<AuthenticationPage />} />
          <Route path="/sign-up" element={<AuthenticationPage />} />
          <Route element={<Layout />}>
            <Route path="/" />
            <Route path="/chat" element={<ChatPage />} />   {/* now safe */}
            <Route path="/meal-survey" element={<MealSurvey />} />
            <Route path="/meal-plan/*" element={<ProtectedMealPlan />}>
              <Route index element={<MealPlanMain />} />
              <Route path="grocery-list" element={<GroceryList />} />
              <Route path="grocery-list/product-search" element={<ProductSearch />} />
            </Route>
            <Route path="/manage-day/*">
              <Route index element={<RoutineDashboard />} />
              <Route path="edit" element={<RoutineEdit />} />
            </Route>
          </Route>
        </Routes>
    </ClerkProviderWithRoutes>
  );
}



export default App