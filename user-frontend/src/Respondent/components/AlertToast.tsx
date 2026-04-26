type Props = {
  data: any;
  onAccept: (data: any) => void;
  onReject: () => void;
};

export const AlertToast = ({ data, onAccept, onReject }: Props) => (
  <div className="w-full max-w-sm rounded-lg border border-red-500 bg-red-50 shadow-lg p-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-600 text-white font-bold">
        {data.alertFrom.firstName?.[0]}
        {data.alertFrom.lastName?.[0]}
      </div>
      <div className="flex-1">
        <p className="text-red-700 font-bold text-sm uppercase tracking-wide">
          Emergency Alert
        </p>
        <p className="font-semibold text-gray-900">
          {data.alertFrom.firstName} {data.alertFrom.lastName}
        </p>
        <p className="text-xs text-gray-600">{data.alertFrom.phone}</p>
      </div>
    </div>
    <p className="mb-4 text-sm text-gray-800">
      Needs immediate assistance. Please respond quickly.
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => onAccept(data)}
        className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
      >
        Accept
      </button>
      <button
        onClick={() => onReject()}
        className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition-colors"
      >
        Reject
      </button>
    </div>
  </div>
);
