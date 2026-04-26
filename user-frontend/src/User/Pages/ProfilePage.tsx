import { useQuery } from "@tanstack/react-query";
import { useFetchClient } from "../../utilities/useFetchClient";

const ProfilePage = () => {
  const { protectedFetch } = useFetchClient();

  const { isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await protectedFetch("http://localhost:3000/user");

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
};

export default ProfilePage;
