return (
    <div className="flex-grow container mx-auto px-6 py-8 bg-light-background dark:bg-dark-background">
        <div className="flex grid-cols-1 lg:grid-cols-3 gap-8 ">
            <form
                onSubmit={handleSubmit}
                className="flex-2 lg:col-span-2 rounded-lg shadow-lg p-6 bg-light-background dark:bg-dark-background border-1 border-accent/70 text-gray-700 dark:text-dark-text"
            ></form>

            <div className="lg:col-span-2 bg-light-background dark:bg-dark-background border-1 border-accent/70 rounded-lg shadow p-6 flex-2"></div>

            <div className="bg-light-background dark:bg-dark-background border-1 border-accent/70 rounded-lg p-6 flex flex-col flex-1">
            </div>
        </div>
    </div>
)