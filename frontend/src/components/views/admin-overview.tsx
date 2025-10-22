import { Component, For, createSignal, onMount, Show } from 'solid-js';
import ClassPanel from '../ClassPanel';
import { loadClassData } from '~/utils/loadClassData';
import CourseCard from '~/components/CourseCard';
import CourseView from '~/pages/CourseView';

export default function AdminPanel() {
    const [showStudentView, setShowStudentView] = createSignal(false);

    const toggle = () => setShowStudentView(!showStudentView());

    return (
        <div>
            <h1>Show Student View</h1>
            <button onClick={toggle}>{showStudentView() ? 'ON' : 'OFF'}</button>

            {showStudentView() ? (
                <CourseView />
            ): <ClassPanel /> }
            

        </div>
    );
}
