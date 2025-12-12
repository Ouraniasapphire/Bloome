export default function useProfileColor(props: {colorID: string }) {
    const profileMap: Record <string, string> = {
        '0': 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white',
        '1': 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
        '2': 'bg-gradient-to-r from-violet-200 to-pink-200 text-black',
    };

    const color = profileMap[props.colorID]

    return color
}