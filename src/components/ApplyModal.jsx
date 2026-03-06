const ApplyModal = ({ job, onConfirm, onTrackOnly, onClose }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">

                <h2 className="text-white font-bold text-xl mb-1">Ready to apply?</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Choose how you want to track <span className="text-white font-medium">{job.title}</span> at <span className="text-white font-medium">{job.company}</span>.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-accent text-black font-bold py-3 rounded-lg hover:opacity-90 transition text-sm"
                    >
                        Apply & Track
                        <span className="block text-xs font-normal opacity-70 mt-0.5">
                            Opens the job listing and adds to your tracker
                        </span>
                    </button>

                    <button
                        onClick={onTrackOnly}
                        className="w-full border border-gray-700 text-white font-semibold py-3 rounded-lg hover:border-gray-500 transition text-sm"
                    >
                        Track Only
                        <span className="block text-xs font-normal text-gray-400 mt-0.5">
                            Add to tracker without opening the listing
                        </span>
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full text-gray-500 hover:text-gray-300 py-2 text-sm transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplyModal;