import { useLocation } from "react-router";

export default function useQueryParams() {
    const search = useLocation().search;
    const urlSearchParams = new URLSearchParams(search);
    const entries = urlSearchParams.entries()
    const params = Array.from(entries).reduce((acc:any, [key, value]) => {
        if (!acc[key]) {
          acc[key] = value;
        } else if (Array.isArray(acc[key])) {
          acc[key].push(value);
        } else {
          acc[key] = [acc[key], value];
        }
        return acc;
      }, {});
    return params;
}
