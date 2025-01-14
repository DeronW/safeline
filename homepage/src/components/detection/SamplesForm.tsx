import { useState } from "react";
import { Message } from "@/components";
import { submitSampleSet, getSampleSetResult } from "@/api/detection";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import SampleSteps from "@/components/detection/SampleSteps";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Title from "@/components/Home/Title";
import type { RecordSamplesType } from "./types";

export default SamplesForm;

function SamplesForm({
  onSetIdChange,
}: {
  onSetIdChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const testHandler = () => {
    setOpen(true);
  };
  const closeHandler = () => {
    setOpen(false);
  };

  const getSetId = async (content: string, tag: string) => {
    const res = await submitSampleSet([{ content, tag }]);
    if (res.code != 0) throw res.msg;
    if (res.data.total != 1) throw "样本数量错误";
    return res.data.id;
  };

  const submit = async ({
    sample,
    isAttack,
  }: {
    sample: string;
    isAttack: boolean;
  }) => {
    setLoading(true);
    try {
      const setId = await getSetId(sample, isAttack ? "black" : "white");
      onSetIdChange(setId);
    } catch (e) {
      Message.error(("解析失败: " + e) as string);
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <Button variant="contained" onClick={testHandler}>
        测试我的样本
      </Button>
      <Modal open={open} onClose={closeHandler}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 750,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "6px",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <Title title="测试我的样本" sx={{ fontSize: "18px", mb: 2 }} />
            <IconButton onClick={closeHandler}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box>
            <SampleSteps onDetect={submit} />
          </Box>
        </Box>
      </Modal>
    </>
  );
}
