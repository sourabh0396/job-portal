import useRozarpay from "@/components/scriptLoader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
const SubscribePage = () => {
  const razorpayLoaded = useRozarpay();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    const token = Cookies.get("token");
    setLoading(true);
  };
  return (
    <div>
      <div></div>
    </div>
  );
};

export default SubscribePage;
