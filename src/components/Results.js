import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalHeader, Badge } from "shards-react";
import { Descriptions } from "antd";

export default function Results(props) {
  const {
    open,
    toggle,
    restart,
    index,
    keys,
    sum,
    currentWordIndex,
    isNewBest,
  } = props;

  function calculateWPM() {
    return Math.trunc((sum + index) / 5);
  }

  return (
    <div className="results-modal">
      <Modal size="lg" centered open={open} toggle={toggle}>
        <ModalHeader>Test Results</ModalHeader>
        <ModalBody className="results">
          <Descriptions bordered column={1} className="mb-4">
            <Descriptions.Item label="Words Per Minute">
              <span className="wpm correct">{calculateWPM()}</span>{" "}
              {isNewBest && (
                <Badge pill className="correct-bg">
                  new best
                </Badge>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Accuracy">
              {parseFloat(
                ((sum + index) / (keys - currentWordIndex)) * 100
              ).toFixed(2) + "%"}
            </Descriptions.Item>
            <Descriptions.Item label="Correct Keystrokes">
              {sum + index}
            </Descriptions.Item>
            <Descriptions.Item label="Total Keystrokes">
              {keys - currentWordIndex}
            </Descriptions.Item>
            <Descriptions.Item label="Correct Words">{index}</Descriptions.Item>
          </Descriptions>
          <FontAwesomeIcon
            onClick={restart}
            className="restart"
            size="lg"
            icon={faSync}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
