import { useEffect } from 'react';
import { ContentProps } from '../../../../Functions/interfaces';
import { useDispatch } from 'react-redux';
import { setSceenWidth, setScreenHeight } from '../../../../Redux/sideBarRedux';
import { useSelector } from 'react-redux';

export default function Content({ children }: ContentProps) {

    const dispatch = useDispatch();
    const width = useSelector((state: any) => state?.sideBarRedux?.width);

    useEffect(() => {
        const updateSize = () => {
            dispatch(setSceenWidth(window.innerWidth))
            dispatch(setScreenHeight(window.innerHeight))
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);



    return (
        <div className={width > 640 ? "ml-64 pt-16" : ""}>
            {children}
        </div>
    );
}


