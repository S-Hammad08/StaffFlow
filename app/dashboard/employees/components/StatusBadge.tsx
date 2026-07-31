type StatusBadgeProps ={
    status : "Active" | "Inactive";
};

const StatusBadge  = (({status} : StatusBadgeProps)=>{
return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium 
    ${status == "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700" }`}>
        {status}
    </span>
);
});
export default StatusBadge ;