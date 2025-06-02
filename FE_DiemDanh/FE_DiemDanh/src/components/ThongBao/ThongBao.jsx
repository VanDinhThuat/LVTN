import { useEffect, useState } from "react";
import { useNavigate } from "zmp-ui";
import { getLocation } from "zmp-sdk/apis";
import { CheckCircle } from "lucide-react";
import "./ThongBao.scss";

const ThongBao = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);  // Lưu địa chỉ
  const [error, setError] = useState(null);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      if (data.error) {
        setError("Không thể lấy địa chỉ từ tọa độ.");
      } else {
        const formattedAddress = data.display_name;
        setAddress(formattedAddress);  // Lưu địa chỉ
      }
    } catch (err) {
      setError("Lỗi khi lấy địa chỉ.");
    }
  };

  useEffect(() => {
    getLocation({
      success: (res) => {
        setLocation(res);
        console.log("Location:", res);
        // Lấy địa chỉ từ tọa độ
        getAddressFromCoordinates(res.latitude, res.longitude);
      },
      fail: (err) => {
        console.error("Location error:", err);
        setError("Không thể lấy vị trí.");
      },
    });
  }, []);

  return (
    <div className="thong-bao-container">
      <CheckCircle className="icon" size={64} color="#4CAF50" />
      <h2>Điểm danh thành công!</h2>
      <p>Chúc bạn một buổi học vui vẻ 🎉</p>
      {location && (
        <div className="location-info">
          <p><strong>Latitude:</strong> {location.latitude}</p>
          <p><strong>Longitude:</strong> {location.longitude}</p>
          {address && <p><strong>Địa chỉ:</strong> {address}</p>}
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <button className="btn-home" onClick={() => navigate("/student")}>
        Về trang chủ
      </button>
    </div>
  );
};

export default ThongBao;
