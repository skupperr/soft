import React from "react";
import { useState, useEffect } from 'react';
import { useApi } from "../../utils/api";
import { RiRobot2Fill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { IoBagCheck } from "react-icons/io5";

const MealSuggestions = ({ mealData, onUpdateMeal }) => {

    const [isLoading, setIsLoading] = useState(false)
    const { makeRequest } = useApi();
    const [text, setText] = useState("");

    const placeholders = [
        "E.g., I want something spicy for Monday's breakfast.",
        "Suggest a vegetarian dinner for Friday.",
        "Plan a protein-rich lunch for Wednesday.",
    ];

    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0); // current phrase
    const [subIndex, setSubIndex] = useState(0); // current char
    const [deleting, setDeleting] = useState(false);
    const [errorDialog, setErrorDialog] = useState(null); // stores error reason

    useEffect(() => {
        if (index >= placeholders.length) return;

        if (
            !deleting &&
            subIndex === placeholders[index].length + 1 // finished typing
        ) {
            setTimeout(() => setDeleting(true), 1500); // pause before deleting
            return;
        }

        if (deleting && subIndex === 0) {
            setDeleting(false);
            setIndex((prev) => (prev + 1) % placeholders.length); // move to next phrase
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (deleting ? -1 : 1));
        }, deleting ? 40 : 70); // speed: delete faster than typing

        return () => clearTimeout(timeout);
    }, [subIndex, deleting, index, placeholders]);

    useEffect(() => {
        setDisplayText(placeholders[index].substring(0, subIndex));
    }, [subIndex, index]);


    const handleGenerate = async () => {
        if (!text.trim()) return;

        try {
            setIsLoading(true);

            const res = await makeRequest("change-meal-plan", {
                method: "POST",
                body: JSON.stringify(text),
            });

            if (res.status === "error") {
                setErrorDialog(res.reason); // show dialog
            } else if (res.status === "success" && res.data) {

                console.log(res);

                // res.data.nutrition is already an object, no need to parse
                const nutrition = res.data.nutrition;

                const newMeal = {
                    title: `${capitalize(res.data.meal_type)}: ${res.data.name}`, // note: 'name' field
                    details: `Calories: ${nutrition.calories} | Protein: ${nutrition.protein_g}g | Carbs: ${nutrition.carbs_g}g | Fat: ${nutrition.fat_g}g`,
                    image: "https://via.placeholder.com/150", // optional, replace with actual image if available
                };

                // Call the parent callback to update mealData
                if (onUpdateMeal) {
                    onUpdateMeal(res.data.day, res.data.meal_type, newMeal);
                }
            }

        } catch (err) {
            console.error("❌ Error sending request:", err);
            setErrorDialog("Network error. Please try again.");
        } finally {
            setText("");
            setIsLoading(false);
        }
    };

    // Helper to capitalize meal type
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);


    return (

        <div className="layout-content-container flex-1 flex-col ">
            <h1 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                Customize Your Meal Plan
            </h1>
            <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
                Not happy with a meal? Select the day and meal you'd like to change, and let us know your cravings or preferences below.
            </p>
            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={displayText}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] 
      focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] min-h-36 
      placeholder:text-[#637488] p-[15px] text-base font-normal leading-normal"
                    />
                </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || mealData.length === 0}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1979e6] text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-lg transition"
                >
                    <span className="truncate">{isLoading ? "Generating..." : "Generate Meal"}</span>
                </button>
            </div>


            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-4">
                Health Suggestions
            </h3>

            {/* Suggested Meal Cards */}
            {/* {[1, 2, 3].map((num) => (
                <div key={num} className="p-4">
                    <div className="flex items-stretch justify-between gap-4 rounded-xl">
                        <div className="flex flex-[2_2_0px] flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#111418] text-base font-bold leading-tight">
                                    Suggested Meal {num}
                                </p>
                                <p className="text-[#637488] text-sm font-normal leading-normal">
                                    Calories: {400 - num * 25} | Protein: {20 - num * 2}g | Carbs: {30 + num * 5}g | Fat: {15 - num}g
                                </p>
                            </div>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-fit">
                                <span className="truncate">Replace</span>
                            </button>
                        </div>
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                            style={{
                                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHSOCgH-0tjkaAHs0lWYntXAGXf1CazoELXNc41LNWljGIF8AVyf8HlLYf1NKzTaEVq2KSZfc4TiCui8024bcmobrqHRjH3DPEOz9q-m6TYFnZPesaxctuT_87Yi2QK6QjZs10KRkuGLKvkj4A-Lk8y_nqqoHb0FzsdwbQU91-XuCghxB8LePuaKqfqbL4loaXcf27jmcmjcC9L6qSzDPMaGGzgQg8KFu6-xtlEWdMRE-iwPdvysfZNGaCLAi8Jd2SIhW932giwrQ")`,
                            }}
                        ></div>
                    </div>
                </div>
            ))} */}

            <div className="grid grid-rows-3 md:grid-rows-3 gap-6 ml-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <p className="font-semibold text-green-800 flex items-center">
                        <IoBagCheck className="w-6 h-6 mr-2" />
                        Better Deal
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                        Store brand milk costs $1.50 less
                    </p>
                    <a
                        className="text-sm font-semibold text-green-800 mt-2 inline-block"
                        href="#"
                    >Switch &amp; Save</a>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <p className="font-semibold text-blue-800 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clipRule="evenodd" />
                        </svg>
                        Bulk
                        Savings
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                        Buy 3 lbs of bananas, save 15%
                    </p>
                    <a
                        className="text-sm font-semibold text-blue-800 mt-2 inline-block"
                        href="#"
                    >Add to Cart</a>
                </div>
                <div
                    className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400"
                >
                    <p className="font-semibold text-purple-800 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-purple-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                        </svg>
                        Seasonal
                    </p>
                    <p className="text-sm text-purple-700 mt-2">
                        Apples are 30% cheaper this week
                    </p>
                    <a
                        className="text-sm font-semibold text-purple-800 mt-2 inline-block"
                        href="#"
                    >View Options</a>
                </div>
            </div>


            {/* Error Dialog */}
            {errorDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-transform duration-300 scale-100">
                        <h2 className="text-lg font-bold mb-4 text-red-600">Error</h2>
                        <p className="mb-6 text-gray-700">{errorDialog}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setErrorDialog(null)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MealSuggestions;