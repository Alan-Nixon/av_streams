import { ContentProps } from '../../../../Functions/interfaces';
import { useSelector } from 'react-redux';

export default function Content({ children }: ContentProps) {
    const width = useSelector((state: any) => state?.sideBarRedux?.width);

      return (
        <div className={width > 640 ? "ml-64 pt-16" : ""}>
            {children}
        </div>
    );
}


