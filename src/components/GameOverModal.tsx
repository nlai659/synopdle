type GameOverModalProps = {
    isVisible: boolean;
    onModalClose: () => void;
    onRandomMovie: () => void;
    numHints: number;
    numHintsUsed: number;
    movieName: string;
    posterPath: string;
};

const GameOverModal = ({ isVisible, onModalClose, onRandomMovie, numHints, numHintsUsed, movieName, posterPath }: GameOverModalProps) => {
    const win = numHintsUsed-1 <= numHints;

    const modalContent = win ? (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Congratulations!</h2>
        </div>
    ) : (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Unlucky!</h2>
        </div>
    );

    return (
        <div className={`fixed inset-0 flex justify-center items-center ${isVisible ? '' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div className="bg-gray-700 rounded-lg shadow-md p-8 max-w-md relative z-50">
                {modalContent}
                <img
                    className="w-full h-auto rounded-md mt-4"
                    src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                    alt={movieName}
                />
                <p className="text-white mb-4">
                    Movie: <span className="font-semibold">{movieName}</span>
                </p>
                <div className="flex justify-between">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        onClick={onRandomMovie}
                        >
                        Play Again!
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-300"
                        onClick={onModalClose}
                        >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;