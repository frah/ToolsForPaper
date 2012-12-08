using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace ToolsForPaper
{
    public partial class Form1 : Form
    {
        private ClipBoardWatcher cbw;
        private bool capEnable;

        public Form1()
        {
            InitializeComponent();
            cbw = new ClipBoardWatcher();
            cbw.DrawClipBoard += handleClipboard;
            capEnable = true;
        }

        private void seqCapMenuItem_Click(object sender, EventArgs e)
        {
            if (!seqCapMenuItem.Checked)
            {
                singleCapMenuItem.Checked = false;
                seqCapMenuItem.Checked = true;
            }
        }

        private void singleCapMenuItem_Click(object sender, EventArgs e)
        {
            if (!singleCapMenuItem.Checked)
            {
                seqCapMenuItem.Checked = false;
                singleCapMenuItem.Checked = true;
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            webBrowser1.Navigate("http://labs.tokcs.com/nr/");
        }

        private void toolStripSplitButton1_ButtonClick(object sender, EventArgs e)
        {
            toggleCaptureEnable();
        }

        private void toggleCaptureEnable()
        {
            if (capEnable)
            {
                cbw.DrawClipBoard -= handleClipboard;
                toolStripSplitButton1.Image = Properties.Resources.diable;
                toolStripSplitButton1.ToolTipText = "クリップボード監視オフ";
                capEnable = false;
            }
            else
            {
                cbw.DrawClipBoard += handleClipboard;
                toolStripSplitButton1.Image = Properties.Resources.enable;
                toolStripSplitButton1.ToolTipText = "クリップボード監視中";
                capEnable = true;
            }
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            cbw.Dispose();
        }

        private void handleClipboard(object sender, EventArgs e)
        {
            if (Clipboard.ContainsText())
            {
                webBrowser1.Navigate("http://labs.tokcs.com/nr/?t=" + Uri.EscapeDataString(Clipboard.GetText()));
                if (singleCapMenuItem.Checked)
                {
                    toggleCaptureEnable();
                }
            }
        }
    }
}
