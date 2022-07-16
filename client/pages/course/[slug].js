import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth/selector";
import { notify } from "../../utils/toast.util";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const SingleCourse = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [course, setCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    console.log("CHECK ENROLLMENT", data);
    setEnrolled(data);
  };

  const fetchCourse = async () => {
    const res = await axios.get(`/api/course/${slug}`);
    console.log(res);
    setCourse(res.data);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handlePaidEnrollment = async () => {
    try {
      setLoading(true);
      // check if user is logged in
      if (!user) router.push("/login");
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      toast("Enrollment failed, try again.");
      console.log(err);
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      // check if user is logged in
      if (!user) router.push("/login");
      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      notify("success", `${data.message}`);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      notify("error", "Enrollment failed. Try again.");
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      {course !== null && (
        <SingleCourseJumbotron
          course={course}
          showModal={showModal}
          setShowModal={setShowModal}
          preview={preview}
          setPreview={setPreview}
          user={user}
          loading={loading}
          handlePaidEnrollment={handlePaidEnrollment}
          handleFreeEnrollment={handleFreeEnrollment}
        />
      )}
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />
      {course?.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default SingleCourse;
