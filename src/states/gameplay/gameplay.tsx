import React, { MouseEventHandler, ReactElement } from "react";
import { interval, ReplaySubject } from "rxjs";
import { Circle } from "../../actors/circle/circle";
import styles from './gameplay.module.css';

interface Props {
    updateState: Function
};

interface State {
    points: number,
    lives: number,
    circles: CircleProps[],
    vbWidth: number,
    vbHeight: number
};

export interface CircleProps {
    id: number,
    colour: string,
    x: number,
    y: number,
    expired: Function,
    onClick: MouseEventHandler
}

export class Gameplay extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            points: 0,
            lives: 3,
            circles: [
                // { id: 0, colour: 'red', x: 15, y: 20, duration: 5, onClick: this.onClick.bind(this) },
                // { id: 1, colour: 'green', x: 25, y: 10, duration: 5, onClick: this.onClick.bind(this) },
                // { id: 2, colour: 'yellow', x: 10, y: 30, duration: 5, onClick: this.onClick.bind(this)}
            ],
            vbWidth: window.innerWidth - 50,
            vbHeight: window.innerHeight - 50
        };

        console.log(this.state);

        this.onClick = this.onClick.bind(this);
    }

    private onDestroy$: ReplaySubject<boolean> = new ReplaySubject(1);
    private numOfCircles = 0;

    private modifyPoints(value: number): void {
        this.setState({
            points: this.state.points + value
        });
    }

    private modifyLives(value: number): void {
        if (this.state.lives + value <= 0) {
            this.props.updateState('title');
        }
        this.setState({
            lives: this.state.lives + value
        });
    };

    expiredCircle(explodes: boolean, id: number): void {
        if (explodes) {
            this.modifyLives(-1);
        }
        this.setState({
            circles: this.state.circles.filter(c => c.id !== id)
        });

    }

    onClick(e: React.MouseEvent<HTMLElement>): void {
        const target = e.target as HTMLElement;
        const id = Number(target.id);
        this.setState({
            circles: this.state.circles.filter(c => c.id !== id)
        });
        console.log({
            isRed: target.classList.contains('red-circle'),
            isGreen: target.classList.contains('green-circle'),
            isYellow: target.classList.contains('yellow-circle')
        });
        if (target.classList.contains('red-circle')) {
            this.modifyLives(-1);
        } else if (target.classList.contains('green-circle')) {
            this.modifyPoints(10);
        } else if (target.classList.contains('yellow-circle')) {
            this.modifyLives(1);
        };

        console.log(this.state);
    };

    componentDidMount(): void {
        interval(1200).subscribe(() => {
            let randomInt = Math.floor(Math.random() * 10);
            let colour;
            if (randomInt >= 0 && randomInt <= 6) {
                colour = 'green';
            } else if (randomInt > 6 && randomInt < 9) {
                colour = 'red';
            } else {
                colour = 'yellow';
            };

            let x = Math.floor(Math.random() * ((this.state.vbWidth - 25) - 25) + 25);
            let y = Math.floor(Math.random() * ((this.state.vbHeight - 25) - 25) + 25);
            const circle: CircleProps = {
                id: this.numOfCircles,
                colour: colour,
                x: x,
                y: y,
                expired: this.expiredCircle.bind(this),
                onClick: this.onClick.bind(this)
            };
            this.numOfCircles++;
            this.setState({
                circles: [...this.state.circles, circle]
            })
        });
    }

    componentWillUnmount(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public render(): ReactElement {
        return (
            <div className={styles.gameplay}>
                <div className={styles.gameplay__score}>
                    <h3>Points: <strong>{this.state.points}</strong></h3>
                    <h3>Lives: <strong>{this.state.lives}</strong></h3>
                </div>
                <svg className={styles.gameplay__svg} width={this.state.vbWidth} height={this.state.vbHeight} viewBox={"0 0 " + this.state.vbWidth + " " +  this.state.vbHeight}>
                    {
                        /* <Circle {...{ colour: 'red', x: 15, y: 20, duration: 5, onClick: this.onClick }} />
                        <Circle {...{ colour: 'green', x: 25, y: 10, duration: 5, onClick: this.onClick}} />
                        <Circle {...{ colour: 'yellow', x: 10, y: 30, duration: 5, onClick: this.onClick}} /> */
                        this.state.circles.map(circle => <Circle {...circle}/>)
                    }
                </svg>
            </div>
        )
    };
};